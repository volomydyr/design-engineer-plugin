# Design Intent Guide

## Where Defaults Hide

Defaults do not announce themselves. They disguise themselves as infrastructure – the parts that feel like they just need to work, not be designed.

### Typography Feels Like a Container

Pick something readable, move on. But typography is not holding your design – it IS your design. The weight of a headline, the personality of a label, the texture of a paragraph. These shape how the product feels before anyone reads a word.

A bakery management tool and a trading terminal might both need "clean, readable type" – but the type that is warm and handmade is not the type that is cold and precise. If you are reaching for your usual font, you are not designing.

### Navigation Feels Like Scaffolding

Build the sidebar, add the links, get to the real work. But navigation is not around your product – it IS your product. Where you are, where you can go, what matters most. A page floating in space is a component demo, not software. The navigation teaches people how to think about the space they are in.

### Data Feels Like Presentation

You have numbers, show numbers. But a number on screen is not design. The question is: what does this number mean to the person looking at it? What will they do with it? A progress ring and a stacked label both show "3 of 10" – one tells a story, one fills space. If you are reaching for number-on-label, you are not designing.

### Token Names Feel Like Implementation Detail

But your design tokens are design decisions. Names like `--ink` and `--parchment` evoke a world. Names like `--gray-700` and `--surface-2` evoke a template. Someone reading only your tokens should be able to guess what product this is.

### The Principle

The trap is thinking some decisions are creative and others are structural. There are no structural decisions. Everything is design. The moment you stop asking "why this?" is the moment defaults take over.

---

## Intent-First Framework

Before collecting references, opening any design tool, or writing any code – answer these questions. Not in your head. Out loud, to yourself or the user.

### Who Is This Human?

Not "users." The actual person. Where are they when they open this? What is on their mind? What did they do 5 minutes ago, what will they do 5 minutes after?

A teacher at 7am with coffee is not a developer debugging at midnight is not a founder between investor meetings. Their world shapes the interface.

If the user cannot describe a specific person, help them get there. Ask about their customers, their day, their frustrations. Abstract users produce abstract interfaces.

### What Must They Accomplish?

Not "use the dashboard." The verb. Grade these submissions. Find the broken deployment. Approve the payment. Track the delivery.

The answer determines what leads, what follows, what hides. Every screen has one thing the user came here to do. That thing should dominate – through size, position, contrast, or the space around it.

### What Should This Feel Like?

Say it in words that mean something. "Clean and modern" means nothing – every AI says that. Try instead:

- Warm like a notebook
- Cold like a terminal
- Dense like a trading floor
- Calm like a reading app
- Precise like a surgical instrument
- Playful like a creative tool

The answer shapes color, type, spacing, density – everything. If you cannot articulate the feeling, you cannot design for it.

**If you cannot answer these three questions with specifics, stop. Ask the user. Do not guess. Do not default.**

---

## Product Domain Exploration

This is where defaults get caught – or do not.

Generic output follows: Task type → Visual template → Theme.
Crafted output follows: Task type → Product domain → Signature → Structure + Expression.

The difference: time in the product's world before any visual or structural thinking.

### Required Outputs

**Do not propose any direction until you produce all four:**

**1. Domain** – Concepts, metaphors, vocabulary from this product's world. Not features – territory. Minimum 5.

Example for a veterinary clinic app: "waiting room, chart, appointment book, vaccination record, weight curve, collar tag, exam table, kennel, after-hours emergency, follow-up call."

Example for a restaurant POS: "ticket rail, table turn, 86'd, mise en place, cover count, comp, modifier, split check, rush, expo window."

**2. Color World** – What colors exist naturally in this product's domain? Not "warm" or "cool" – go to the actual world. If this product were a physical space, what would you see? List 5+.

Example for a veterinary clinic: "clinical white, scrub teal, warming lamp amber, stainless steel, antiseptic blue, chart manila, collar red."

Example for a restaurant POS: "ticket white, kitchen stainless, flame orange, chalkboard black, wine burgundy, garnish green."

**3. Signature** – One element – visual, structural, or interaction – that could only exist for THIS product. If you can name it for any product, keep exploring.

Example for a veterinary clinic: "A patient card that looks like a chart sleeve with a weight curve sparkline where the photo would be."

Example for a restaurant POS: "Table status displayed as a physical floor plan with color-coded seats, not a list."

**4. Named Defaults** – 3 obvious choices for this interface type – visual AND structural. You cannot avoid patterns you have not named.

Example for a veterinary clinic: "Default sidebar + card dashboard, default blue accent, default appointment calendar widget."

Name what you will do instead and why.

### The Test

Read your proposal. Remove the product name. Could someone identify what this is for? If not, it is generic. Explore deeper.

---

## The Design-From-Intent Principle

Design should emerge from the specific problem, the specific user, the specific context. When you design from intent, generic output becomes unlikely because no two intents are identical.

This is not about being different for its own sake. It is about the interface emerging from the work it needs to support. A veterinary clinic app should feel different from a restaurant POS not because you tried to make them different, but because you spent time in each world and the worlds are different.

When every choice traces back to intent, the design has character. When choices come from patterns, the design has conformity. Character is what people remember.

---

## State Your WHY Checkpoint

**Every time** you write UI – even small additions – state:

```
Intent: [who is this human, what must they do, how should it feel]
Palette: [colors from your domain exploration – and WHY they fit this product's world]
Depth: [borders / shadows / layered – and WHY this fits the intent]
Surfaces: [your elevation scale – and WHY this color temperature]
Typography: [your typeface – and WHY it fits the intent]
Spacing: [your base unit]
```

This checkpoint is mandatory. It forces you to connect every technical choice back to intent.

If you cannot explain WHY for each choice, you are defaulting. Stop and think.

### The WHY Litmus Test

For every decision, ask:

- Why this layout and not another?
- Why this color temperature?
- Why this typeface?
- Why this spacing scale?
- Why this information hierarchy?

If your answer is "it is common" or "it is clean" or "it works" – you have not chosen. You have defaulted.

**The swap test:** If you swapped your choices for the most common alternatives and the design did not feel meaningfully different, you never made real choices. The places where swapping would not matter are the places you defaulted.
