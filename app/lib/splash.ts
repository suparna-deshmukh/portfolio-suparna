// AskCart splash: a field of e-commerce search phrases that gathers into the wordmark.
// Each row: vertical position, x offset, entry drift and delay; each word: [text, font size px, tone 5 to 8].

export interface SplashRow { y: number; tx: number; dy: number; d: number; words: [string, number, number][] }

export const SPLASH_ROWS: SplashRow[] = [
  { y: 70, tx: -26, dy: -24, d: 368, words: [['waterproof?', 25, 8], ['size chart', 15, 5], ['battery life', 13, 6], ['return policy', 17, 5], ['price drop', 21, 8], ['AskCart', 14, 6]] },
  { y: 112, tx: -8, dy: -22, d: 322, words: [['warranty claim', 16, 5], ['in stock?', 21, 8], ['gift wrap', 14, 6], ['shipping time', 25, 8], ['cash on delivery', 15, 5], ['AskCart', 13, 6]] },
  { y: 156, tx: -44, dy: -20, d: 276, words: [['sneaker deal', 14, 6], ['slow charging', 26, 8], ['screen cracked', 16, 5], ['AskCart', 13, 6], ['compare price', 19, 7], ['best rating', 15, 5]] },
  { y: 200, tx: -12, dy: -18, d: 230, words: [['firm mattress', 15, 5], ['travel size', 13, 6], ['AskCart', 22, 8], ['one piece dress', 16, 5], ['noise cancelling', 14, 5], ['AskCart', 20, 7]] },
  { y: 246, tx: -34, dy: -16, d: 184, words: [['gift for mom', 17, 5], ['delivery by friday', 14, 6], ['AskCart', 16, 5], ['matte finish', 16, 5], ['2 year warranty', 15, 5], ['AskCart', 21, 8]] },
  { y: 292, tx: -6, dy: -14, d: 138, words: [['bluetooth 5.3', 25, 8], ['hand wash only', 15, 5], ['AskCart', 14, 6], ['price history', 16, 5], ['vegan leather', 23, 8], ['AskCart', 13, 6]] },
  { y: 338, tx: -40, dy: -12, d: 92, words: [['bluetooth 5.3', 25, 8], ['hand wash only', 15, 5], ['AskCart', 14, 6], ['price history', 16, 5], ['vegan leather', 23, 8], ['AskCart', 13, 6]] },
  { y: 386, tx: -16, dy: -10, d: 46, words: [['bluetooth 5.3', 25, 8], ['hand wash only', 15, 5], ['AskCart', 14, 6], ['price history', 16, 5], ['vegan leather', 23, 8], ['AskCart', 13, 6]] },
  { y: 434, tx: -2, dy: 0, d: 0, words: [['bluetooth 5.3', 25, 8], ['hand wash only', 15, 5], ['AskCart', 14, 6], ['price history', 16, 5], ['vegan leather', 23, 8], ['AskCart', 13, 6]] },
  { y: 482, tx: -36, dy: 10, d: 46, words: [['bluetooth 5.3', 25, 8], ['hand wash only', 15, 5], ['AskCart', 14, 6], ['price history', 16, 5], ['vegan leather', 23, 8], ['AskCart', 13, 6]] },
  { y: 528, tx: -10, dy: 12, d: 92, words: [['bluetooth 5.3', 25, 8], ['hand wash only', 15, 5], ['AskCart', 14, 6], ['price history', 16, 5], ['vegan leather', 23, 8], ['AskCart', 13, 6]] },
  { y: 574, tx: -30, dy: 14, d: 138, words: [['bluetooth 5.3', 25, 8], ['hand wash only', 15, 5], ['AskCart', 14, 6], ['price history', 16, 5], ['vegan leather', 23, 8], ['AskCart', 13, 6]] },
  { y: 620, tx: -6, dy: 16, d: 184, words: [['bluetooth 5.3', 25, 8], ['hand wash only', 15, 5], ['AskCart', 14, 6], ['price history', 16, 5], ['vegan leather', 23, 8], ['AskCart', 13, 6]] },
  { y: 666, tx: -42, dy: 18, d: 230, words: [['bluetooth 5.3', 25, 8], ['hand wash only', 15, 5], ['AskCart', 14, 6], ['price history', 16, 5], ['vegan leather', 23, 8], ['AskCart', 13, 6]] },
  { y: 712, tx: -18, dy: 20, d: 276, words: [['bluetooth 5.3', 25, 8], ['hand wash only', 15, 5], ['AskCart', 14, 6], ['price history', 16, 5], ['vegan leather', 23, 8], ['AskCart', 13, 6]] },
  { y: 756, tx: -4, dy: 22, d: 322, words: [['bluetooth 5.3', 25, 8], ['hand wash only', 15, 5], ['AskCart', 14, 6], ['price history', 16, 5], ['vegan leather', 23, 8], ['AskCart', 13, 6]] },
  { y: 800, tx: -32, dy: 24, d: 368, words: [['bluetooth 5.3', 25, 8], ['hand wash only', 15, 5], ['AskCart', 14, 6], ['price history', 16, 5], ['vegan leather', 23, 8], ['AskCart', 13, 6]] },
]
