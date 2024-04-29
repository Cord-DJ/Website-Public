cd apps
echo "Total HTML lines of core:"
find . -name '*.html' | xargs wc -l | tail -n 1

echo "Total SCSS lines of core:"
find . -name '*.scss' | xargs wc -l | tail -n 1

echo "Total TS lines of core:"
find . -name '*.ts' | xargs wc -l | tail -n 1
