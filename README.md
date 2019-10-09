# CRA Typescript React Testing Library Test

This is an example form with React, TypeScript, Jest, React Testing Library, and Snapshots

## Requirements

- Node `10.16.3`
- Yarn on NPM

## Description

This is a component with a form being tested.

It will test for 5 things.

1. Test that the view has all the fields present with a snapshot (form, input, button, errors)
2. Test that a user can update the fields data with state
3. Test that missing fields will show an error message
4. Test that submitting the form will disable the fields
5. Test the form success will empty fields

## Main Files

- `/src/components/App/index.tsx` - Main Component
- `/src/components/App/fetchApi.ts` - Fake fetch requests that simulates an API request as a promise
- `/src/components/App/index.test.tsx` - Where all tests are located
- `/src/components/App/__snapshots__` - Where snapshot tests are stored

## Run Tests

```bash
yarn test;
```
