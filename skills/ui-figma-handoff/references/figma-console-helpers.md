# Figma Console MCP Helper Functions

Code snippets for common Figma Console MCP operations. These are designed to run via `figma_execute` and handle the quirks of the Figma Plugin API.

---

## Token Extraction

Recursively walk a node tree and extract all unique design tokens. Use during Phase 1 (Audit).

```javascript
async function extractTokens(node, results) {
  // Skip hidden elements – they are often junk or forgotten layers
  if (node.visible === false) return;

  // Colors (fills)
  if (node.fills && node.fills !== figma.mixed) {
    for (const f of node.fills) {
      if (f.type === 'SOLID' && f.visible !== false) {
        const c = f.color;
        const hex = `#${Math.round(c.r*255).toString(16).padStart(2,'0')}${Math.round(c.g*255).toString(16).padStart(2,'0')}${Math.round(c.b*255).toString(16).padStart(2,'0')}`;
        results.colors.add(f.opacity < 1 ? `${hex}@${f.opacity}` : hex);
      }
    }
  }

  // Typography
  if (node.type === 'TEXT' && node.fontName !== figma.mixed) {
    const key = `${node.fontName.family}|${node.fontName.style}|${node.fontSize}|${JSON.stringify(node.lineHeight)}`;
    results.typography.add(key);
  }

  // Spacing (from auto-layout frames)
  if (node.layoutMode && node.layoutMode !== 'NONE') {
    for (const v of [node.paddingTop, node.paddingRight, node.paddingBottom, node.paddingLeft, node.itemSpacing]) {
      if (v > 0) results.spacing.add(v);
    }
  }

  // Border radius
  if (node.cornerRadius && node.cornerRadius > 0 && node.cornerRadius !== figma.mixed) {
    results.radius.add(node.cornerRadius);
  }

  // Effects (shadows, blurs)
  if (node.effects && node.effects.length > 0) {
    results.effects.add(JSON.stringify(node.effects));
  }

  // Recurse into children
  if (node.children) {
    for (const child of node.children) await extractTokens(child, results);
  }
}

// Usage:
// const results = { colors: new Set(), typography: new Set(), spacing: new Set(), radius: new Set(), effects: new Set() };
// await extractTokens(figma.currentPage, results);
// return { colors: [...results.colors], typography: [...results.typography], spacing: [...results.spacing].sort((a,b) => a-b), radius: [...results.radius].sort((a,b) => a-b), effects: [...results.effects] };
```

---

## Full Audit Function

Check a rebuilt screen for any remaining raw (unbound) values. Use during Phase 7 (Quality Pass). The audit must return 0 issues before declaring a screen complete.

```javascript
async function fullAudit(node, path, results) {
  // Skip hidden nodes
  if (node.visible === false) return;

  const p = path ? `${path} > ${node.name}` : node.name;

  // 1. Check fills for bound variables
  if (node.fills && node.fills !== figma.mixed && node.fills.length > 0) {
    for (const f of node.fills) {
      if (f.type === 'SOLID' && f.visible !== false && !f.boundVariables?.color?.id) {
        const c = f.color;
        results.push({
          path: p, id: node.id, issue: 'raw fill',
          color: `rgb(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)})`
        });
      }
    }
  }

  // 2. Check text styles
  if (node.type === 'TEXT') {
    if (node.textStyleId === figma.mixed) {
      // Mixed-style text – check per-range
      const len = node.characters.length;
      for (let i = 0; i < len; i++) {
        const tsId = node.getRangeTextStyleId(i, i+1);
        const fsId = node.getRangeFillStyleId(i, i+1);
        if (!tsId) {
          results.push({ path: p, id: node.id, issue: 'raw text style in range', pos: i });
          break; // Report once per node
        }
        if (!fsId) {
          results.push({ path: p, id: node.id, issue: 'raw fill style in range', pos: i });
          break;
        }
      }
    } else if (!node.textStyleId || node.textStyleId === '') {
      results.push({ path: p, id: node.id, issue: 'no text style' });
    }
  }

  // 3. Check spacing bindings
  if (node.layoutMode && node.layoutMode !== 'NONE') {
    const bv = node.boundVariables || {};
    for (const prop of ['paddingTop','paddingRight','paddingBottom','paddingLeft','itemSpacing']) {
      if (node[prop] > 0 && !bv[prop]?.id) {
        results.push({ path: p, id: node.id, issue: `raw ${prop}`, value: node[prop] });
      }
    }
  }

  // 4. Check corner radius
  if (node.cornerRadius && node.cornerRadius !== 0 && node.cornerRadius !== figma.mixed) {
    const bv = node.boundVariables || {};
    if (!bv.topLeftRadius?.id) {
      results.push({ path: p, id: node.id, issue: 'raw cornerRadius', value: node.cornerRadius });
    }
  }

  // 5. Skip instance children (managed by the component)
  if (node.children && node.type !== 'INSTANCE') {
    for (const child of node.children) { await fullAudit(child, p, results); }
  }
}

// Usage:
// const results = [];
// await fullAudit(screenNode, '', results);
// return results; // Should be empty (length === 0) for a complete screen
```

---

## Bind Color Variable to Node Fills

Bind a color variable to the first fill of a node.

```javascript
async function bindFill(node, varId) {
  const v = await figma.variables.getVariableByIdAsync(varId);
  if (!v || !node.fills || node.fills === figma.mixed || node.fills.length === 0) return;
  const f = [...node.fills];
  f[0] = figma.variables.setBoundVariableForPaint(f[0], 'color', v);
  node.fills = f;
}
```

---

## Bind Float Variable to Layout Property

Bind a float variable (spacing, sizing) to a node property.

```javascript
async function bindFloat(node, prop, varId) {
  const v = await figma.variables.getVariableByIdAsync(varId);
  if (v) node.setBoundVariable(prop, v);
}
```

---

## Bind Corner Radius to Variable (All 4 Corners)

Bind a single radius variable to all four corners of a node.

```javascript
async function bindRadius(node, varId) {
  const v = await figma.variables.getVariableByIdAsync(varId);
  if (!v) return;
  node.setBoundVariable('topLeftRadius', v);
  node.setBoundVariable('topRightRadius', v);
  node.setBoundVariable('bottomLeftRadius', v);
  node.setBoundVariable('bottomRightRadius', v);
}
```

---

## Bind Strokes Deep Inside an Instance

Recursively bind a color variable to all strokes within an instance's children (vectors, shapes, lines).

```javascript
async function bindStrokesDeep(instanceId, varId) {
  const node = await figma.getNodeByIdAsync(instanceId);
  const variable = await figma.variables.getVariableByIdAsync(varId);
  if (!node || !variable) return;

  function processNode(n) {
    if (!n.children) return;
    for (const child of n.children) {
      if (['VECTOR','BOOLEAN_OPERATION','ELLIPSE','RECTANGLE','LINE','POLYGON','STAR'].includes(child.type)) {
        if (child.strokes && child.strokes.length > 0) {
          const strokes = [...child.strokes];
          strokes[0] = figma.variables.setBoundVariableForPaint(strokes[0], 'color', variable);
          child.strokes = strokes;
        }
      }
      if (child.children) processNode(child);
    }
  }
  processNode(node);
}
```

---

## Read Tree Structure for Comparison

Read a node tree and return a structured object for comparing original vs. rebuilt screens. Reports bound variable status for fills and spacing.

```javascript
function readTree(node, depth) {
  // Skip hidden elements
  if (node.visible === false) return null;

  const info = { name: node.name, type: node.type, id: node.id };
  if (node.width) { info.w = Math.round(node.width); info.h = Math.round(node.height); }

  if (node.type === 'TEXT') {
    info.text = node.characters?.slice(0, 50);
    info.fontSize = node.fontSize !== figma.mixed ? node.fontSize : 'mixed';
    info.fontName = node.fontName !== figma.mixed
      ? `${node.fontName.family} ${node.fontName.style}` : 'mixed';
  }

  if (node.fills && node.fills !== figma.mixed && node.fills.length > 0 && node.fills[0].type === 'SOLID') {
    const c = node.fills[0].color;
    info.fill = `#${Math.round(c.r*255).toString(16).padStart(2,'0')}${Math.round(c.g*255).toString(16).padStart(2,'0')}${Math.round(c.b*255).toString(16).padStart(2,'0')}`;
    info.fillBound = !!node.fills[0].boundVariables?.color?.id;
  }

  if (node.cornerRadius && node.cornerRadius !== figma.mixed) info.radius = node.cornerRadius;

  if (node.layoutMode && node.layoutMode !== 'NONE') {
    info.layout = node.layoutMode;
    info.padding = [node.paddingTop, node.paddingRight, node.paddingBottom, node.paddingLeft];
    info.spacing = node.itemSpacing;
    const bv = node.boundVariables || {};
    info.spacingBound = {
      pT: !!bv.paddingTop?.id, pR: !!bv.paddingRight?.id,
      pB: !!bv.paddingBottom?.id, pL: !!bv.paddingLeft?.id,
      iS: !!bv.itemSpacing?.id
    };
  }

  if (node.type === 'INSTANCE') info.isInstance = true;

  if (node.children && depth < 5) {
    info.children = node.children.map(c => readTree(c, depth + 1)).filter(c => c !== null);
  }
  return info;
}

// Usage:
// const tree = readTree(screenNode, 0);
// return JSON.stringify(tree, null, 2);
```

---

## Apply Mixed-Style Text with Styles

Apply text styles and paint styles to specific character ranges within a text node. Use for text that has multiple font weights or colors.

```javascript
async function applyMixedTextStyles(textNodeId, ranges, defaultTextStyle, defaultPaintStyle) {
  const tn = await figma.getNodeByIdAsync(textNodeId);
  // Load all required fonts before modifying text
  // await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  // await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  for (const range of ranges) {
    await tn.setRangeTextStyleIdAsync(range.start, range.end, range.textStyleId || defaultTextStyle);
    await tn.setRangeFillStyleIdAsync(range.start, range.end, range.paintStyleId || defaultPaintStyle);
  }
}

// Usage:
// await applyMixedTextStyles('123:456', [
//   { start: 0, end: 5, textStyleId: boldStyleId, paintStyleId: accentPaintId },
//   { start: 5, end: 20, textStyleId: regularStyleId, paintStyleId: defaultPaintId }
// ], regularStyleId, defaultPaintId);
```

---

## Scan for Mixed-Style Text Ranges

Analyze a text node to identify distinct font/color ranges. Useful for understanding mixed-style text before applying styles.

```javascript
function scanMixedRanges(textNode) {
  const text = textNode.characters;
  const len = text.length;
  const ranges = [];
  let i = 0;

  while (i < len) {
    const font = textNode.getRangeFontName(i, i+1);
    const fills = textNode.getRangeFills(i, i+1);
    const c = fills[0]?.color;
    let j = i + 1;

    while (j < len) {
      const nf = textNode.getRangeFontName(j, j+1);
      const nc = textNode.getRangeFills(j, j+1)[0]?.color;
      if (nf.family === font.family && nf.style === font.style &&
          Math.abs(nc.r - c.r) < 0.01 && Math.abs(nc.g - c.g) < 0.01 && Math.abs(nc.b - c.b) < 0.01) {
        j++;
      } else break;
    }

    ranges.push({
      start: i, end: j,
      text: text.slice(i, j),
      font: `${font.family} ${font.style}`,
      rgb: [Math.round(c.r*255), Math.round(c.g*255), Math.round(c.b*255)]
    });
    i = j;
  }
  return ranges;
}

// Usage:
// const ranges = scanMixedRanges(textNode);
// return ranges; // Array of { start, end, text, font, rgb }
```
