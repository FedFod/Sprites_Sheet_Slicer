autowatch = 1;
outlets = 1;

include("SpriteSheet.js");

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

var gWindowRatio = 1;
var gJSUISize = [0,0];
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

function slice_padding(width, height)
{
    spriteSheet.SetSlicePadding(width, height);
    mgraphics.redraw();
}

function load_sprite_sheet(path)
{
    spriteSheet.LoadSpriteSheet(path);
    spriteSheet.RescaleImage();
    mgraphics.redraw();
}

//PRIVATE FUNCTIONS -----------

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
    spriteSheet.FillSpriteSheetBackground(mgraphics);
    spriteSheet.DrawSizeText(mgraphics);
    spriteSheet.DrawIgnoreAlphaText(mgraphics);
    spriteSheet.DrawSpriteSheet(mgraphics);
    spriteSheet.DrawHighlightAreas(mgraphics);
    spriteSheet.DrawSelectedSprite(mgraphics);
}
paint.local = 1;

function onresize(width, height)
{   
    CalcJSUISize();
    CalcWindowRatio();
    spriteSheet.RescaleImage();
    mgraphics.redraw();
    // print(width, height)
}
onresize.local = 1;

function notifydeleted()
{
    spriteSheet.Destroy();
}
notifydeleted.local = 1;