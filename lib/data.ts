export interface Word {
  kr: string;
  rom: string;
  jp: string;
  song: string;
  ctx: string;
}

export interface LyricItem {
  song: string;
  line: string;   // contains <BLANK>
  blank: string;
  jp: string;
  opts: string[];
}

export const WORDS: Word[] = [
  { kr: "보고싶다", rom: "bo-go-sip-da", jp: "会いたい",       song: "BTS • Spring Day",      ctx: "봄날の歌詞から" },
  { kr: "그리워",   rom: "geu-ri-wo",   jp: "恋しい",         song: "BTS • Spring Day",      ctx: "봄날の歌詞から" },
  { kr: "기다려",   rom: "gi-da-ryeo",  jp: "待ってる",       song: "BTS • Spring Day",      ctx: "봄날の歌詞から" },
  { kr: "사랑해",   rom: "sa-rang-hae", jp: "愛してる",       song: "BLACKPINK • Love",      ctx: "ラブソングから" },
  { kr: "예뻐",     rom: "ye-bbeo",     jp: "かわいい",       song: "NewJeans • Hype Boy",   ctx: "Hype Boyから" },
  { kr: "같이",     rom: "ga-chi",      jp: "一緒に",         song: "BTS • Butter",          ctx: "Butterから" },
  { kr: "행복해",   rom: "haeng-bo-kae",jp: "幸せ",           song: "IU • 밤편지",            ctx: "밤편지から" },
  { kr: "꿈",       rom: "kkum",        jp: "夢",             song: "EXO • Dream",           ctx: "Dreamから" },
  { kr: "별",       rom: "byeol",       jp: "星",             song: "BTS • Spring Day",      ctx: "봄날の歌詞から" },
  { kr: "바람",     rom: "ba-ram",      jp: "風",             song: "BTS • Spring Day",      ctx: "봄날の歌詞から" },
  { kr: "눈물",     rom: "nun-mul",     jp: "涙",             song: "IU • 밤편지",            ctx: "밤편지から" },
  { kr: "웃어",     rom: "u-seo",       jp: "笑って",         song: "TWICE • Feel Special",  ctx: "Feel Specialから" },
  { kr: "설레",     rom: "seol-le",     jp: "ドキドキする",   song: "SEVENTEEN • Fallin'",   ctx: "Fallin'から" },
  { kr: "안녕",     rom: "an-nyeong",   jp: "こんにちは",     song: "BTS • Spring Day",      ctx: "汎用表現" },
  { kr: "고마워",   rom: "go-ma-wo",    jp: "ありがとう",     song: "IU • 좋은 날",           ctx: "좋은 날から" },
  { kr: "괜찮아",   rom: "gwaen-cha-na",jp: "大丈夫",         song: "BIGBANG • Loser",       ctx: "Loserから" },
];

export const LYRICS: LyricItem[] = [
  {
    song: "BTS • Spring Day",
    line: "보고싶다 이렇게 <BLANK> 나",
    blank: "말하니까",
    jp: "会いたい、こう言うから",
    opts: ["말하니까", "사랑해", "기다려", "예뻐"],
  },
  {
    song: "BTS • Spring Day",
    line: "<BLANK>을 간직한 채로",
    blank: "그리움",
    jp: "懐かしさを抱えたまま",
    opts: ["그리움", "행복", "눈물", "꿈"],
  },
  {
    song: "BTS • Butter",
    line: "하루 종일 너와 <BLANK> 있어",
    blank: "같이",
    jp: "一日中君と一緒にいる",
    opts: ["같이", "혼자", "사랑", "웃어"],
  },
  {
    song: "NewJeans • Hype Boy",
    line: "너 때문에 내가 <BLANK>",
    blank: "예뻐",
    jp: "あなたのせいでかわいくなってる",
    opts: ["예뻐", "슬퍼", "기다려", "보고싶다"],
  },
  {
    song: "IU • 밤편지",
    line: "<BLANK>이 돼서",
    blank: "별",
    jp: "星になって",
    opts: ["별", "꿈", "바람", "눈물"],
  },
  {
    song: "TWICE • Feel Special",
    line: "나를 봐 줘서 <BLANK>",
    blank: "고마워",
    jp: "見てくれてありがとう",
    opts: ["고마워", "괜찮아", "안녕", "사랑해"],
  },
];

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
