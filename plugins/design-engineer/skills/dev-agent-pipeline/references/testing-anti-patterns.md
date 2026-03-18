# Testing Anti-Patterns

Tests must verify real behavior, not mock behavior. Mocks are a means to isolate, not the thing being tested.

## Anti-Pattern 1: Testing Mock Behavior

```typescript
// BAD: Testing that the mock exists
test('renders sidebar', () => {
  render(<Page />);
  expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
});
```

You're verifying the mock works, not that the component works. The test passes when the mock is present, fails when it's removed. This tells you nothing about real behavior.

**Fix:** Test the real component, or if the dependency must be mocked for isolation, don't assert on the mock — assert on the behavior of the component under test.

**Gate:** Before asserting on any mock element, ask: "Am I testing real behavior or mock existence?" If mock existence, delete the assertion.

## Anti-Pattern 2: Test-Only Methods in Production

```typescript
// BAD: destroy() only exists for test cleanup
class Session {
  async destroy() {
    await this._workspaceManager?.destroyWorkspace(this.id);
  }
}

// In tests
afterEach(() => session.destroy());
```

Production code now contains methods that are dangerous if called in production. It pollutes the class API and confuses the object lifecycle.

**Fix:** Put cleanup in test utilities, not production classes.

```typescript
// Good: test-utils/
export async function cleanupSession(session: Session) {
  const workspace = session.getWorkspaceInfo();
  if (workspace) await workspaceManager.destroyWorkspace(workspace.id);
}
```

**Gate:** Before adding a method to a production class, ask: "Is this only used by tests?" If yes, put it in test utilities.

## Anti-Pattern 3: Mocking Without Understanding

```typescript
// BAD: Mock prevents config write that test depends on
vi.mock('ToolCatalog', () => ({
  discoverAndCacheTools: vi.fn().mockResolvedValue(undefined)
}));

await addServer(config);
await addServer(config);  // Should throw duplicate — but won't
```

The mocked method had a side effect (writing config) that the test depended on. Over-mocking "to be safe" broke the behavior being tested.

**Fix:** Mock at the correct level. Mock the slow or external part, preserve the behavior the test needs.

**Gate:** Before mocking any method:
1. What side effects does the real method have?
2. Does this test depend on any of those side effects?
3. If yes — mock at a lower level, not this method
4. If unsure — run the test with the real implementation first, observe what happens, then add minimal mocking

**Red flags:** "I'll mock this to be safe." "This might be slow, better mock it." Mocking without understanding the dependency chain.

## Anti-Pattern 4: Incomplete Mocks

```typescript
// BAD: Only mocked fields you think you need
const mockResponse = {
  status: 'success',
  data: { userId: '123', name: 'Alice' }
  // Missing: metadata that downstream code accesses
};
```

Partial mocks hide structural assumptions. Downstream code may depend on fields you didn't include. Tests pass but integration fails. False confidence.

**Fix:** Mock the COMPLETE data structure as it exists in reality. Check actual API responses from docs/examples and include all fields the system might consume downstream.

## Anti-Pattern 5: Tests as Afterthought

```
✅ Implementation complete
❌ No tests written
"Ready for testing"
```

Testing is part of implementation, not an optional follow-up. If TDD was followed, this cannot happen. If it happened, TDD was skipped.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll test after" | Tests passing immediately prove nothing. You never saw them catch the bug. |
| "Tests after achieve the same goals" | Tests-after answer "what does this do?" Tests-first answer "what should this do?" Tests-after are biased by your implementation. |
| "Already manually tested" | Ad-hoc ≠ systematic. No record, can't re-run, easy to forget cases. |
| "Deleting X hours is wasteful" | Sunk cost fallacy. Keeping unverified code is technical debt. |
| "Keep as reference, write tests first" | You'll adapt it. That's testing after. Delete means delete. |
| "Need to explore first" | Fine. Throw away the exploration. Start fresh with TDD. |
| "Hard to test = design unclear" | Listen to the test. Hard to test = hard to use. The test is telling you the design needs to change. |
| "TDD will slow me down" | TDD is faster than debugging. You pay now or pay more later. |
| "This is different because..." | It's not. All of these excuses lead to the same place: untested code. |

## Red Flags — Stop and Start Over

Any of these mean TDD was violated:

- Code written before test
- Test written after implementation
- Test passes immediately on first run
- Can't explain why the test failed
- Tests added "later"
- Rationalizing "just this once"
- Keeping pre-test code as "reference"

**All of these mean: delete the code, start over with a failing test.**

## Quick Reference

| Anti-Pattern | Fix |
|--------------|-----|
| Assert on mock elements | Test real component or unmock it |
| Test-only methods in production | Move to test utilities |
| Mock without understanding | Understand dependencies first, mock minimally |
| Incomplete mocks | Mirror real API response completely |
| Tests as afterthought | TDD — tests first, always |
| Mock setup > 50% of test | Consider integration tests with real components |
