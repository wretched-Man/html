# automate simple and boring tasks for HTML
lines = []
with open('temp_text.txt', 'r') as f:
    lines = f.read().rstrip('\n').split('\n')

for line in lines:
    if len(line) > 1 and not line == "Video":
        print(line)