function SpriteSheet()
{
    this.spriteSheetImage = null;
    this.spriteSheetMatrix = null;
    this.spriteToDrawImage = null;
    this.imagePath = null;
    this.spriteSheetImageName = null;
    this.spriteSheetImageRatio = -1;
    this.border = [0,0,gJSUISize[0], 20];
    this.backgroundColor = [0.45, 0.45, 0.45, 1.0];
    this.titleBacgroundColor = [0.3,0.3,0.3,1.0];
    this.spriteSheetBackgroundColor = [0.8, 0.8, 0.9, 1.0];
    this.originalImageSize = [0,0];
    this.sliceArea = [38,38];
    this.slicePadding = [0,0];
    this.sliceOffset = [0,0];
    this.rescaleFactor = [1,1];
    this.spaceBetweenTexts = 50;
    this.drawArea = [1,1];
    this.outputMatrices = [];
    this.ignoreZeroAlpha = 0;
    this.jit3m = new JitterObject("jit.3m");
    this.selectedSpriteIndex = -1;
    this.textSize = [];
    this.bgImage = new Image("imageBG.png");

    this.mg = null;
    this.offscreenBuffer = null;
    this.squaresPositions = [];

    this.LoadSpriteSheet = function(path)
    {   
        this.EmptyMatricesArray();  
        this.spriteToDrawImage = new Image();
        this.spriteSheetMatrix = new JitterMatrix();
        this.imagePath = path;
        var tempPath = path;
        tempPath = tempPath.replace(/^.*[\\\/]/, '');
        this.spriteSheetImageName = tempPath.replace(/\.[^/.]+$/, "");
        this.spriteSheetImage = new Image(path);
        this.spriteSheetImage.tonamedmatrix(this.spriteSheetMatrix.name);
        this.originalImageSize = this.spriteSheetImage.size.slice();
        this.CalcImageRatio();
    }

    this.SetIgnoreZeroAlpha = function(flag)
    {
        this.ignoreZeroAlpha = flag;
    }

    this.CutSprites = function()
    {   
        this.EmptyMatricesArray();

        var columns = Math.floor(this.originalImageSize[0]/this.sliceArea[0]);
        var rows    = Math.floor(this.originalImageSize[1]/this.sliceArea[1]);

        for (var i=0; i<rows; i++)
        {
            for (var j=0; j<columns; j++)
            {
                this.outputMatrices.push(new JitterMatrix(4, "char", this.sliceArea.slice()));
                this.outputMatrices[this.outputMatrices.length-1].usesrcdim = 1;
                this.outputMatrices[this.outputMatrices.length-1].srcdimstart = [(this.sliceArea[0]+this.slicePadding[0])*j+this.sliceOffset[0], 
                                                                                (this.sliceArea[1]+this.slicePadding[1])*i+this.sliceOffset[1]];
                this.outputMatrices[this.outputMatrices.length-1].srcdimend = [(this.sliceArea[0]+this.slicePadding[0])*j+this.sliceArea[0]+this.sliceOffset[0], 
                                                                              (this.sliceArea[1]+this.slicePadding[1])*i+this.sliceArea[1]+this.sliceOffset[1]];
                this.outputMatrices[this.outputMatrices.length-1].frommatrix(this.spriteSheetMatrix.name);
                this.jit3m.matrixcalc(this.outputMatrices[this.outputMatrices.length-1], this.outputMatrices[this.outputMatrices.length-1]);

                if (this.jit3m.mean[3] == 0.0 && this.ignoreZeroAlpha)
                {
                    this.outputMatrices.splice(-1, 1);
                }
            }
        }
    }
 
    this.ExportSprites = function(path)
    {   
        print(path)
        for (var mat in this.outputMatrices)
        {   
            if (path != null)
            {
                this.outputMatrices[mat].exportimage(path+this.spriteSheetImageName+"_"+mat+".png");
            } 
            else 
            {
                print("No path provided")
            }
        }
    }

    this.OutputSprite = function(index)
    {   
        if (index >= 0 && index < this.outputMatrices.length)
        {   
            var matName = this.outputMatrices[index].name;
            outlet(0, ["jit_matrix", matName]);
            this.selectedSpriteIndex = index;
        }
    }

    this.OutputSpritesArray = function()
    {   
        var namesArray = ["matrix_names"];
        for (var mat in this.outputMatrices)
        {
            namesArray.push(this.outputMatrices[mat].name);
        }
        outlet(0, namesArray);
    }

    this.DrawSelectedSprite = function(mg)
    {   
        if (this.selectedSpriteIndex >= 0 && this.selectedSpriteIndex < this.outputMatrices.length && 
            gJSUISize[0] > (this.spriteSheetImage.size[0]+(this.border[3]*4)))
        {   
            var imgSide = (gJSUISize[1]-this.border[3])*(3/4);
            var imgSize = [imgSide, imgSide];
            var imgPos = [this.spriteSheetImage.size[0]+gJSUISize[0]/20, ((gJSUISize[1]-this.border[3])/8)+this.border[3]];

            // this.CreateCheckerPattern(mg,50,imgSize,imgPos);
            var tempBG = new Image("imageBG.png");
            tempBG.scale(imgSize);

            var tempMatrix = new JitterMatrix();
            tempMatrix.dim = imgSize.slice();
            tempMatrix.adapt = 0;
            tempMatrix.planecount = 4;
            tempMatrix.frommatrix(this.outputMatrices[this.selectedSpriteIndex].name);

            this.spriteToDrawImage.scale(imgSize);
            this.spriteToDrawImage.fromnamedmatrix(tempMatrix.name);
            mg.identity_matrix();
            mg.translate(imgPos);
            mg.image_surface_draw(tempBG);
            mg.image_surface_draw(this.spriteToDrawImage);

            tempMatrix.freepeer();
            tempBG.freepeer();
        }
    }

    this.CalcImageRatio = function()
    {
        this.spriteSheetImageRatio = this.spriteSheetImage.size[0] / this.spriteSheetImage.size[1];
    }

    this.GetImageRatio = function()
    {
        return this.spriteSheetImageRatio;
    }
    
    this.SetSliceOffset = function(offsetX, offsetY)
    {
        this.sliceOffset = [offsetX, offsetY];
    }

    this.SetSliceArea = function(width, height)
    {   
        var tempWidth = Math.max(width, 1);
        var tempHeight = Math.max(height, 1);
        this.sliceArea = [tempWidth, tempHeight];
    }

    this.SetSlicePadding = function(width, height)
    {
        this.slicePadding = [width, height];
    }

    this.CalcBorderSize = function()
    {
        this.border[2] = gJSUISize[0];
    }

    this.FillBackground = function(mg)
    {
        mg.set_source_rgba(this.backgroundColor);
        mg.rectangle(0,0,gJSUISize[0], gJSUISize[1]);
        mg.fill();
    }

    this.FillSpriteSheetBackground = function(mg)
    {   
        if (this.spriteSheetImage != null && this.bgImage != null)
        {   
            this.mg = new MGraphics(this.spriteSheetImage.size);
            // this.CreateCheckerPattern(mg,10,this.spriteSheetImage.size,[this.border[3]/2, this.border[3]]);
            var columns = this.spriteSheetImage.size[0] / this.bgImage.size[0];
            var rows = this.spriteSheetImage.size[1] / this.bgImage.size[1];
            for (var i=0; i<columns; i++)
            {
                for (var j=0; j<rows; j++)
                {   
                    this.mg.identity_matrix();
                    this.mg.translate(i*this.bgImage.size[0], j*this.bgImage.size[1]);
                    this.mg.image_surface_draw(this.bgImage);
                }
            }
            this.offscreenBuffer = new Image(this.mg);
        }
    }

    this.DrawOffScreenBuffer = function(mg)
    {   
        if (this.offscreenBuffer != null)
        {
            mg.identity_matrix();
            mg.translate(this.border[3]/2, this.border[3]);
            mg.image_surface_draw(this.offscreenBuffer);
        }
    }

    this.DrawIndexNumbers = function(mg)
    {
        for (var i=0; i<this.outputMatrices.length; i++)
        {
            mg.identity_matrix();
            var textPosition = this.squaresPositions[i];
            mg.move_to(textPosition);
            mg.set_font_size(15);
            mg.set_source_rgba([0,0,0,1]);
            var string = i.toString(); 
            this.textSize = mg.text_measure(string);
            mg.text_path(string);
            mg.fill();
        }   
    }

    this.CreateCheckerPattern = function(mg, checkerSize, imageSize, leftCorner)
    {
        var colors = [[0.6,0.6,0.6,1], [0.8,0.8,0.8,1]];
        var counter = 0;
        for (var i=0; i<imageSize[0]; i+=checkerSize)
        {   
            counter = 0;
            if ((i%(checkerSize*2)) == 0)
            {
                counter = 1;
            } 
            for (var j=0; j<imageSize[1]; j+=checkerSize)
            {  
                mg.set_source_rgba(colors[counter%2]);
                mg.rectangle(i+leftCorner[0], j+leftCorner[1], checkerSize, checkerSize);
                mg.fill();
                counter++;
            }
        }
    }

    this.DrawSpriteSheet = function(mg)
    {   
        if (this.spriteSheetImage != null)
        {   
            mg.identity_matrix();
            mg.translate(this.border[3]/2, this.border[3]);
            mg.image_surface_draw(this.spriteSheetImage);
        }
    }

    this.RescaleImage = function()
    {   
        this.CalcBorderSize();

        if (this.imagePath != null)
        {   
            this.spriteSheetImage = new Image(this.imagePath);
            var tempMatrix1 = new JitterMatrix();
            tempMatrix1.importmovie(this.imagePath);
            var tempMatrix2 = new JitterMatrix();

            if (this.spriteSheetImageRatio <= gWindowRatio)
            {   
                this.rescaleFactor[0] = this.spriteSheetImageRatio/gWindowRatio;
                this.rescaleFactor[1] = 1;
            }
            else 
            {   
                this.rescaleFactor[0] = 1;
                this.rescaleFactor[1] = gWindowRatio/this.spriteSheetImageRatio;
            }
            tempMatrix2.dim = [(gJSUISize[0]-this.border[3]-this.border[3]/2)*this.rescaleFactor[0], (gJSUISize[1]-this.border[3]-this.border[3]/2)*this.rescaleFactor[1]];
            tempMatrix2.adapt = 0;
            tempMatrix2.planecount = 4;
            tempMatrix2.frommatrix(tempMatrix1.name);

            this.spriteSheetImage.scale((gJSUISize[0]-this.border[3]-this.border[3]/2)*this.rescaleFactor[0], 
                                        (gJSUISize[1]-this.border[3]-this.border[3]/2)*this.rescaleFactor[1]);
        
            this.spriteSheetImage.fromnamedmatrix(tempMatrix2.name);
            tempMatrix1.freepeer();
            tempMatrix2.freepeer();
        }
    }

    this.DrawHighlightAreas = function(mg)
    {   
        if (this.spriteSheetImage != null)
        {   
            var imageToWindowRatioX = ((gJSUISize[0]-this.border[3]-this.border[3]/2) / this.originalImageSize[0]); 
            var imageToWindowRatioY = ((gJSUISize[1]-this.border[3]-this.border[3]/2) / this.originalImageSize[1]); 

            var finalScaleX = imageToWindowRatioX * this.rescaleFactor[0];
            var finalScaleY = imageToWindowRatioY * this.rescaleFactor[1];

            var sliceAreaX = this.sliceArea[0] * finalScaleX;
            var sliceAreaY = this.sliceArea[1] * finalScaleY;
            
            var xPad = this.slicePadding[0] * finalScaleX;
            var yPad = this.slicePadding[1] * finalScaleY;

            var xOffset = this.sliceOffset[0] * finalScaleX;
            var yOffset = this.sliceOffset[1] * finalScaleY;

            var columns = Math.floor(this.originalImageSize[0] / this.sliceArea[0]);  
            var rows = Math.floor(this.originalImageSize[1] / this.sliceArea[1]);

            for (var i=0; i<columns; i++)
            {   
                var xPos = i*(sliceAreaX+xPad)+xOffset;
                if ((xPos+sliceAreaX) <= this.spriteSheetImage.size[0]+10)
                {
                    for (var j=0; j<rows; j++)
                    {   
                        var yPos = j*(sliceAreaY+yPad)+yOffset;
                        if ((yPos+sliceAreaY) <= this.spriteSheetImage.size[1]+10)
                        {   
                            this.squaresPositions[i+(j*columns)] = [xPos, yPos];
                            mg.set_source_rgba(1,0,0,1);
                            mg.set_line_width(1);
                            mg.rectangle(xPos, yPos, sliceAreaX, sliceAreaY);
                            mg.stroke();
                        }
                    }
                }
            }
        }
    }

    this.DrawSizeText = function(mg)
    {	
        mg.identity_matrix();
        mg.set_source_rgba(this.titleBacgroundColor);
        mg.rectangle(0,0,gJSUISize[0], this.border[3]);
        mg.fill();

        if (this.spriteSheetImage != null)
        {   
            mg.set_font_size(12);
            mg.set_source_rgba([1,1,1,1]);
            var sizeString = "Image Size: "+this.originalImageSize[0] + " x " + this.originalImageSize[1];
            this.textSize = mg.text_measure(sizeString);
            mg.move_to(10, this.textSize[1]);
            this.textSize[0] += this.spaceBetweenTexts;
            mg.text_path(sizeString);
            mg.fill();
        }
    }

    this.DrawIgnoreAlphaText = function(mg)
    {	
        if (this.spriteSheetImage != null)
        {   
            mg.set_font_size(12);
            mg.set_source_rgba([1,1,1,1]);
            var string = "Ignore Zero Alpha Rects: "+this.ignoreZeroAlpha;
            var textMeasure = mg.text_measure(string);
            mg.move_to(this.textSize[0], textMeasure[1]);
            this.textSize[0] += textMeasure[0]+this.spaceBetweenTexts;
            mg.text_path(string);
            mg.fill();
        }
    }

    this.DrawNumberOfSpritesText = function(mg)
    {
        if (this.spriteSheetImage != null)
        {
            mg.set_font_size(12);
            mg.set_source_rgba([1,1,1,1]);
            var string = "Sprites: "+this.outputMatrices.length;
            var textMeasure = mg.text_measure(string);
            mg.move_to(this.textSize[0]-10, textMeasure[1]);
            this.textSize[0] += textMeasure[0]+this.spaceBetweenTexts;
            mg.text_path(string);
            mg.fill();
        }
    }

    this.EmptyMatricesArray = function()
    {
        for (var i=0; i<this.outputMatrices.length; i++)
        {
            this.outputMatrices[i].freepeer();
        }
        this.outputMatrices = [];
    }

    this.Destroy = function()
    {   
        this.Clear();
        if (this.spriteSheetMatrix != null)
            this.spriteSheetMatrix.freepeer();
        if (this.spriteToDrawImage != null)
            this.spriteToDrawImage.freepeer();
        this.bgImage.freepeer();
        this.jit3m.freepeer();
    }

    this.Clear = function()
    {
        this.EmptyMatricesArray();
        if (this.spriteSheetImage != null)
            this.spriteSheetImage.freepeer();
        if (this.offscreenBuffer != null)
            this.offscreenBuffer.freepeer();
        this.offscreenBuffer = null;
    }
}