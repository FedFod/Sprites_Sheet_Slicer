autowatch = 1;
outlets = 1;

include("SpriteSheetSlicer_SpriteSheet.js");

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

var gWindowRatio = 1;
var gJSUISize = [0,0];
SetJSUIInitialSize();
CalcJSUISize();
CalcWindowRatio();

var spriteSheet = new SpriteSheet();

// PUBLIC FUNCTIONS ------------

function export_sprites(path)
{
    spriteSheet.ExportSprites(path);
}

function ignore_zero_alpha_sprites(flag)
{
    spriteSheet.SetIgnoreZeroAlpha(flag);
    mgraphics.redraw();
}

function destroy_mat_array()
{
    spriteSheet.EmptyMatricesArray();
}

function slice_sprites()
{
    spriteSheet.CutSprites();
    mgraphics.redraw();
}

function output_sprite(index)
{
    spriteSheet.OutputSprite(index, mgraphics);
    mgraphics.redraw();
}

function output_matrices_names_list()
{
    spriteSheet.OutputSpritesArray();
}

function slice_area(width, height)
{
    spriteSheet.SetSliceArea(width, height);
    mgraphics.redraw();
}

function slice_offset(offsetX, offsetY)
{
    spriteSheet.SetSliceOffset(offsetX, offsetY);
    mgraphics.redraw();
}

function slice_padding(width, height)
{
    spriteSheet.SetSlicePadding(width, height);
    mgraphics.redraw();
}

function load_sprite_sheet(path)
{
    spriteSheet.LoadSpriteSheet(path);
    spriteSheet.RescaleImage();
    spriteSheet.FillSpriteSheetBackground(mgraphics);
    mgraphics.redraw();
}

function clear()
{
    spriteSheet.Clear();
    mgraphics.redraw();
}

//PRIVATE FUNCTIONS -----------

function SetJSUIInitialSize()
{
    box.rect = [box.rect[0], box.rect[1],box.rect[0]+380, box.rect[1]+200];
}

function CalcJSUISize()
{
    var width = (box.rect[2]-box.rect[0]);
    var height = (box.rect[3]-box.rect[1]);
    gJSUISize = [width, height];
}

function CalcWindowRatio()
{   
    gWindowRatio = gJSUISize[0] / gJSUISize[1]; 
}
CalcWindowRatio.local = 1;

function paint()
{   
    spriteSheet.FillBackground(mgraphics);
    spriteSheet.DrawSizeText(mgraphics);
    spriteSheet.DrawIgnoreAlphaText(mgraphics);
    spriteSheet.DrawNumberOfSpritesText(mgraphics);
    spriteSheet.DrawOffScreenBuffer(mgraphics);
    spriteSheet.DrawSpriteSheet(mgraphics);
    spriteSheet.DrawHighlightAreas(mgraphics);
    spriteSheet.DrawSelectedSprite(mgraphics);
    // spriteSheet.DrawIndexNumbers(mgraphics);
}
paint.local = 1;

function onresize(width, height)
{   
    CalcJSUISize();
    CalcWindowRatio();
    if (spriteSheet)
    {
        spriteSheet.RescaleImage();
        spriteSheet.FillSpriteSheetBackground(mgraphics);
    }
    mgraphics.redraw();
    // print(width, height)
}
onresize.local = 1;

function notifydeleted()
{
    spriteSheet.Destroy();
    mgraphics.redraw();
}

function print() 
{
	for (var i = 0; i < arguments.length; i++) {
   		post(arguments[i]);
  	}
	post();
}
print.local = 1;