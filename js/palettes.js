const PALETTE_COUNT = 8
const PALETTE_BYTE_COUNT = 1024 // 4 bytes per color * 256 colors
const GAP_AFTER_PALETTE = 32

function calculatePaletteOffset(buffer) {
    let offset = 0

    // Signature Length
    const SignatureLength = 16 // 0x10
    offset += SignatureLength

    // Character Name Length
    const CharacterNameLength = 256 // 0x100
    offset += CharacterNameLength

    // Read Move Count (4 bytes)
    const dataView = new DataView(buffer.buffer)
    const MoveCount = dataView.getInt32(offset, true)
    offset += 4

    // Skip Move Data
    const MoveActionListLength = 39 // 0x27
    offset += MoveCount * MoveActionListLength

    // Read iUnknown and Skip Related Data (4 bytes + iUnknown << 4)
    const iUnknown = dataView.getInt32(offset, true)
    offset += 4 + (iUnknown << 4)

    // Read Frame Count (4 bytes)
    const FrameCount = dataView.getInt32(offset, true)
    offset += 4

    // Process Each Sprite
    for (let i = 0; i < FrameCount; i++) {
        offset += 4 // Skip 4 bytes (initial offset in sprite data)

        // Read width and height data (4 bytes each)
        const width = dataView.getInt32(offset, true)
        offset += 4

        const height = dataView.getInt32(offset, true)
        offset += 4

        // Check for Private Palette
        const hasPrivatePalette = dataView.getInt32(offset, true) !== 0
        offset += 4

        // Custom sprite size
        let iSize = dataView.getInt32(offset, true)
        offset += 4

        if (iSize === 0) {
            // size set to width * height if 0
            iSize = width * height
            if (iSize > 0 && hasPrivatePalette) {
                iSize += PALETTE_BYTE_COUNT // Private Palette
            }
        }

        offset += iSize // Skip sprite data
    }

    // At this point, offset points to the start of the SharedPalettes section
    return offset
}

// Get array of 8 palettes for custom transfer
function extractPalettes(buffer, paletteOffset) {
    const palettes = []

    for (let i = 0; i < PALETTE_COUNT; i++) {
        const start = paletteOffset + i * (PALETTE_BYTE_COUNT + GAP_AFTER_PALETTE)
        const end = start + PALETTE_BYTE_COUNT
        palettes.push(buffer.slice(start, end)) // Extract only the palette bytes
    }

    return palettes
}

// Quick and simple code copy to get just the Image Data offset
function calculateImageDataOffset(buffer) {
    let offset = 0

    // Signature Length
    const SignatureLength = 16 // 0x10
    offset += SignatureLength

    // Character Name Length
    const CharacterNameLength = 256 // 0x100
    offset += CharacterNameLength

    // Read Move Count (4 bytes)
    const dataView = new DataView(buffer.buffer)
    const MoveCount = dataView.getInt32(offset, true)
    offset += 4

    // Skip Move Data
    const MoveActionListLength = 39 // 0x27
    offset += MoveCount * MoveActionListLength

    // Read iUnknown and Skip Related Data (4 bytes + iUnknown << 4)
    const iUnknown = dataView.getInt32(offset, true)
    offset += 4 + (iUnknown << 4)
    
    return offset
}