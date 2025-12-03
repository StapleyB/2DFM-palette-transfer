# 2dfm-palette-transfer

Preserving custom 2DFM .player palettes can be such a headache if the game has an update. Anyone who manually had to reinput rgb values through the 2DFM editor can attest to that. 
This tool aims to make a quick and easy way to transfer palettes from one .player file to another.

## How to Use

First, input the source and target .player files. The 'source' file is the one that has your custom palettes and the 'target' is the file that you want to paste the palettes onto.
If you just want to transfer all the palettes, there's nothing left to do. Just press the 'Transfer Palettes' button to generate the new .player file. Once the file is generated, 
click the link to download your new player file.

### Advanced Options

This tool comes with the ability to customize how the palettes are transferred. To access this, press the 'Advanced Options' button and open the palette selector menu.

You will see 8 selectors with which to customize the **target** palettes. By default, they will say `<unchanged>`. This means if you click 'Transfer Palettes', nothing will change about the target .player file. To restore default functionality, simply close the menu by clicking the 'Advanced Options' button again.

What this allows, however, is the ability to move your custom palettes if a new update adds a new palette over a slot you already wrote to. For example, in the Palette 5 selector, selecting 'Source Palette 3' will move the 3rd palette on the source file to the 5th palette on the target.

Beneath the palette selectors is a checkbox that allows you to transfer sprite image data between the player files, for purposes such as quickly transferring sprite mods. Will not break/crash the game if transferring between .player files with different numbers of images, but the game may be unplayable in other ways; if an I block calls an image index out of range of the new sprite data it will simply render nothing, leaving the character invisible.


## Changelog

### v0.1

Initial Release. 

### v0.2

Added image data transfer option to preserve sprite mods.