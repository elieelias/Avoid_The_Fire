const fs = require('fs');
const content = fs.readFileSync('app/page.tsx', 'utf8');

let newContent = content.replace(
  "import GameOver from '@/components/GameOver';",
  "import GameOver from '@/components/GameOver';\nimport Leaderboard from '@/components/Leaderboard';"
);

newContent = newContent.replace(
  "case AppState.GAME_OVER:",
  "case AppState.LEADERBOARD:\n        return (\n          <Leaderboard\n            player={player}\n            setAppState={setAppState}\n            setPlayer={setPlayer}\n          />\n        );\n\n      case AppState.GAME_OVER:"
);

fs.writeFileSync('app/page.tsx', newContent);
