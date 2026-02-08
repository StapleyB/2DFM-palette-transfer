document.addEventListener("DOMContentLoaded", () => {
    const sourceInput = document.getElementById("sourceFile")
    const targetInput = document.getElementById("targetFile")
    const transferButton = document.getElementById("transferButton")
    const downloadLink = document.getElementById("downloadLink")
    const output = document.getElementById("output")
    const transferError = document.getElementById("transfer_error")

    let sourceFileBuffer, targetFileBuffer

    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(new Uint8Array(reader.result))
            reader.onerror = () => reject(reader.error)
            reader.readAsArrayBuffer(file)
        })
    }

    // Transfer button enabled when both files are input.
    function updateButtonState() {
        transferButton.disabled = !(sourceFileBuffer && targetFileBuffer)
        if (transferButton.disabled) {
            transferButton.title = 'Input source and target .player files above'
        } else {
            transferButton.title = ''
        }
    }
    updateButtonState()

    const tooltip = document.getElementById("tooltip")
    function showTooltip() {
        tooltip.classList.add("show")
        setTimeout(() => {
            tooltip.classList.remove("show")
        }, 2000)
    }

    sourceInput.addEventListener("change", async (event) => {
        const file = event.target.files[0]
        if (file) {
            sourceFileBuffer = await readFile(file)
            updateButtonState()
        }
    })

    targetInput.addEventListener("change", async (event) => {
        const file = event.target.files[0]
        if (file) {
            targetFileBuffer = await readFile(file)
            updateButtonState()
        }
    })


    transferButton.addEventListener("click", () => {
        try {
            const TotalPaletteSize = PALETTE_COUNT * (PALETTE_BYTE_COUNT + GAP_AFTER_PALETTE)
            transferError.style.display = 'none'

            // Calculate palette offsets
            const sourcePaletteOffset = calculatePaletteOffset(sourceFileBuffer)
            const targetPaletteOffset = calculatePaletteOffset(targetFileBuffer)

            const sourcePaletteData = extractPalettes(sourceFileBuffer, sourcePaletteOffset)
            let targetPaletteData

            // Advanced palette picking
            if (useAdvanced) {
                targetPaletteData = extractPalettes(targetFileBuffer, targetPaletteOffset)
                for (let i = 1; i <= 8; i++) {
                    const selectedValue = document.getElementById(`palette${i}`).value
                    if (selectedValue !== '<unchanged>') {
                        targetPaletteData[i - 1] = sourcePaletteData[parseInt(selectedValue) - 1]
                    }
                }
            } else {
                targetPaletteData = sourcePaletteData
            }

            collapseTargetData = new Uint8Array(TotalPaletteSize)
            let offset = 0;
            for (let i = 0; i < 8; i++) {
                collapseTargetData.set(targetPaletteData[i], offset);
                offset += PALETTE_BYTE_COUNT + GAP_AFTER_PALETTE;
            }


            // Generate output buffer
            let outputBuffer;

            if (useAdvanced && document.getElementById("image-transfer").checked) {
                // Staple the source image data into the target player file if desired
                // Image data may be variable length
                const targetStartToImageData = new Uint8Array(targetFileBuffer).slice(0, calculateImageDataOffset(targetFileBuffer))
                const targetPalletsToEnd = new Uint8Array(targetFileBuffer).slice(targetPaletteOffset)
                const sourceImageData = new Uint8Array(sourceFileBuffer).slice(calculateImageDataOffset(sourceFileBuffer), sourcePaletteOffset)
                outputBuffer = new Uint8Array(targetStartToImageData.length + targetPalletsToEnd.length + sourceImageData.length)
                outputBuffer.set(targetStartToImageData, 0)
                outputBuffer.set(sourceImageData, targetStartToImageData.length)
                outputBuffer.set(targetPalletsToEnd, targetStartToImageData.length + sourceImageData.length)

                // Replacing palette data
                outputBuffer.set(collapseTargetData, targetStartToImageData.length + sourceImageData.length)
            } else {
                outputBuffer = new Uint8Array(targetFileBuffer)
                outputBuffer.set(collapseTargetData, targetPaletteOffset)
            }

            // Create a downloadable file
            const blob = new Blob([outputBuffer], { type: "application/octet-stream" })
            downloadLink.href = URL.createObjectURL(blob)
            downloadLink.download = targetInput.files[0]?.name
            downloadLink.textContent = targetInput.files[0]?.name
            output.style.display = 'block'
            showTooltip()
        } catch (e) {
            transferError.style.display = 'block'
        }
    })
})