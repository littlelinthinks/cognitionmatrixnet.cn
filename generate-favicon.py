from PIL import Image, ImageDraw, ImageFont

size = 64
img = Image.new('RGBA', (size, size), (10, 11, 13, 255))
draw = ImageDraw.Draw(img)

# 背景圆角矩形
r = 12
draw.rounded_rectangle([2, 2, size-2, size-2], radius=r, fill=(0, 229, 255, 255))

# 画 M 字母（尝试用默认字体）
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
except:
    font = ImageFont.load_default()

text = "M"
bbox = draw.textbbox((0, 0), text, font=font)
text_w = bbox[2] - bbox[0]
text_h = bbox[3] - bbox[1]
x = (size - text_w) / 2
y = (size - text_h) / 2 - 2
draw.text((x, y), text, font=font, fill=(10, 11, 13, 255))

img.save('public/favicon.ico', format='ICO', sizes=[(32,32), (64,64)])
print('favicon.ico generated')
