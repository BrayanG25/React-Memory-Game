import { CardType } from "../utils/DataTypes"

export const generateCardsNumbers = (numPairs: number): CardType[] => {
    const cards: CardType[] = []
    
    for (let i = 1; i <= numPairs; i++) {
        cards.push({ id: i * 2 - 1, name: i.toString(), flipped: false, matched: false })
        cards.push({ id: i * 2, name: i.toString(), flipped: false, matched: false })
    }
    
    return cards
}

export const generateCardsFoods = (numPairs: number): CardType[] => {
    const emojis = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥭', '🍑', '🍋', '🍔', '🍕', '🍟', '🌮', '🌯', '🍩', '🍪', '🎈', '🎉', '🎂']; 
    const usedEmojis = new Set<string>();
    const cards: CardType[] = [];

    for (let i = 0; i < numPairs; i++) {
        let emoji;
        do {
            emoji = emojis[Math.floor(Math.random() * emojis.length)];
        } while (usedEmojis.has(emoji));
        usedEmojis.add(emoji);

        cards.push({ id: i * 2 + 1, name: emoji, flipped: false, matched: false });
        cards.push({ id: i * 2 + 2, name: emoji, flipped: false, matched: false });
    }

    return cards;
};

export const shuffleArray = (array: CardType[]): CardType[] => {
    return array.sort(() => Math.random() - 0.5)
}