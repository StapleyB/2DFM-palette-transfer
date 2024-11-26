let useAdvanced = false
document.addEventListener('DOMContentLoaded', function () {
    const paletteSelectorsContainer = document.getElementById('paletteSelectors')

    const advanced_button = document.getElementById("advanced_options")
    advanced_button.addEventListener("click", () => {
        useAdvanced = !useAdvanced
        paletteSelectorsContainer.style.display = useAdvanced ? "block" : "none"
    })

    for (let i = 1; i <= 8; i++) {
        const label = document.createElement('label')
        label.textContent = `Palette ${i}: `
        
        const select = document.createElement('select')
        select.id = `palette${i}`
        
        const unchangedOption = document.createElement('option')
        unchangedOption.value = "<unchanged>"
        unchangedOption.textContent = "<unchanged>"
        select.appendChild(unchangedOption)
    
        for (let j = 1; j <= 8; j++) {
            const option = document.createElement('option')
            option.value = j.toString()
            option.textContent = `Source Palette ${j}`
            select.appendChild(option)
        }

        label.appendChild(select)
        paletteSelectorsContainer.appendChild(label)
        paletteSelectorsContainer.appendChild(document.createElement('br'))
    }
})
