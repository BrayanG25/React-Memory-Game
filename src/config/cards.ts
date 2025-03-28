import { CardType } from "../utils/DataTypes"

const generateCardsFoods = (numPairs: number): CardType[] => {
    const foods = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥭', '🍑', '🍋', '🍔', '🍕', '🍟', '🌮', '🌯', '🍩', '🍪', '🎈', '🎉', '🎂']
    const usedFoods = new Set<string>()
    const cards: CardType[] = []

    for (let i = 0; i < numPairs; i++) {
        let emoji
        do {
            emoji = foods[Math.floor(Math.random() * foods.length)]
        } while (usedFoods.has(emoji))
        
        usedFoods.add(emoji)

        cards.push({ id: i * 2 + 1, name: emoji, flipped: false, matched: false })
        cards.push({ id: i * 2 + 2, name: emoji, flipped: false, matched: false })
    }

    return cards
}

const generateCardsNumbers = (numPairs: number): CardType[] => {
    const cards: CardType[] = []
    
    for (let i = 1; i <= numPairs; i++) {
        cards.push({ id: i * 2 - 1, name: i.toString(), flipped: false, matched: false })
        cards.push({ id: i * 2, name: i.toString(), flipped: false, matched: false })
    }
    
    return cards
}

const generateCardsEmojis = (numPairs: number): CardType[] => {
    const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🥰', '😍', '😘', '😗', '😙', '😚', '😋', '😜', '😝', '😛']
    const usedEmojis = new Set<string>()
    const cards: CardType[] = []

    for (let i = 0; i < numPairs; i++) {
        let emoji
        do {
            emoji = emojis[Math.floor(Math.random() * emojis.length)]
        } while (usedEmojis.has(emoji))

        usedEmojis.add(emoji)

        cards.push({ id: i * 2 + 1, name: emoji, flipped: false, matched: false })
        cards.push({ id: i * 2 + 2, name: emoji, flipped: false, matched: false })
    }

    return cards
}

const generateCardsObjects = (numPairs: number): CardType[] => {
    const objects = ['📱', '💻', '🖥️', '📷', '🎧', '🎮', '🕶️', '⌚', '💼', '👜', '🎒', '📚', '📖', '✏️', '🖊️', '🖌️', '🔑', '🔒', '🗝️', '🧳']
    const usedObjects = new Set<string>()
    const cards: CardType[] = []

    for (let i = 0; i < numPairs; i++) {
        let emoji
        do {
            emoji = objects[Math.floor(Math.random() * objects.length)]
        } while (usedObjects.has(emoji))

        usedObjects.add(emoji)

        cards.push({ id: i * 2 + 1, name: emoji, flipped: false, matched: false })
        cards.push({ id: i * 2 + 2, name: emoji, flipped: false, matched: false })
    }

    return cards
}

const shuffleArray = (array: CardType[]): CardType[] => {
    return array.sort(() => Math.random() - 0.5)
}

export const cardTypeHandler = (cardType: string, numPairs: number) => {
    if (typeof cardType !== 'string' || cardType.trim() === '') {
        throw new Error("Invalid input: cardType must be a string.")
    }

    const normalizedCardType = cardType.toLowerCase()

    switch (normalizedCardType) {
        case 'cardsfruits':
            return shuffleArray(generateCardsFoods(numPairs))
        case 'cardsnumbers':
            return shuffleArray(generateCardsNumbers(numPairs))
        case 'cardsemojis':
            return shuffleArray(generateCardsEmojis(numPairs))
        case 'cardsobjects':
            return shuffleArray(generateCardsObjects(numPairs))
        default:
            return shuffleArray(generateCardsFoods(numPairs))
    }
}