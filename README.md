Vet du inte vad du ska göra? Du kan väl för i helvete komma på nåt själv!

## Kom igång

Kräver Node 24 (se `.nvmrc`).

```bash
npm install
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

## Skript

- `npm run dev` – utvecklingsserver
- `npm run build` – produktionsbygge (typkontrollerar med TypeScript 7)
- `npm run lint` – ESLint
- `npm test` – Vitest

`typescript` pekar på TypeScript 6-kompatibilitetspaketet så att typescript-eslint
har ett API att prata med, medan `tsc` kommer från TypeScript 7 (`@typescript/native`).
