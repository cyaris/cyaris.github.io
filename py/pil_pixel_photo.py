from PIL import Image
import numpy as np
import pandas as pd
from copy import deepcopy

# Open Paddington
img = Image.open("../img/profile_photo.jpeg")

# Resize smoothly down to 48x48 pixels
xMax = 48
yMax = 48
imgSmall = img.resize((48,48),resample=Image.BILINEAR)

# Scale back up using NEAREST to original size
result = imgSmall.resize(img.size,Image.NEAREST)

# Save pixel photo
result.save('../img/profile_photo_pixelated.png')

# creating a dataframe with rgb codes for each pixel.
pixel_df = pd.DataFrame()
row = 0
for x in np.arange(0, xMax):
    for y in np.arange(0, yMax):
        pixel_rgb = deepcopy(imgSmall.getpixel((int(x),int(y))))
        print(row)
        print('\n')
        print(pixel_df)
        pixel_df.loc[row, 'r'] = pixel_rgb[0]
        pixel_df.loc[row, 'g'] = pixel_rgb[1]
        pixel_df.loc[row, 'b'] = pixel_rgb[2]
        pixel_df.to_csv('../_includes/profile_photo/proile_photo_pixel_rgb_codes.csv', sep = ',', index=None)
        row+=1
