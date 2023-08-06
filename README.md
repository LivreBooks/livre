<div align="center">
    <img src="https://raw.githubusercontent.com/LivreBooks/livre/main/assets/logo.png" width="200" height="200" style="display: block; margin: 0 auto"/>
    <h1>Livre</h1>
    <p>A mobile client for <a href="https://ligen.is">Library Genesis</a> for downloading and reading books.</p>

[![React Native](https://img.shields.io/badge/-React%20Native-3a83f9?style=for-the-badge&logo=react&logoColor=white&labelColor=2ec781)](https://reactnative.dev)
</div>

## Features

- Recommendations - Book recommendations for various Genres.
- Searching - Search books by Title or Author.
- Download - Download books in pdf and epub format.
- Supports all Categories currently on libgen.is.
- Download Library - All Books downloaded are added to your local library.
- Reader - An inbuilt app book reader supporting pdf and epub files.
- Online Account - All downloads are saved to the user's account enabling restoring when switching devices.
- Extras
  - Restore to the last page read.
  - Bookmarks
  - Reader Themes
  - Dark Mode

## Screenshots

<p>
  <img width="16%" src="https://github.com/LivreBooks/livre/blob/main/screenshots/search%20tab.png?raw=true"/>
  <img width="16%" src="https://github.com/LivreBooks/livre/blob/main/screenshots/search.png?raw=true"/>
  <img width="16%" src="https://github.com/LivreBooks/livre/blob/main/screenshots/explore-tab.png?raw=true"/>
  <img width="16%" src="https://github.com/LivreBooks/livre/blob/main/screenshots/category.png?raw=true"/>
  <img width="16%" src="https://github.com/LivreBooks/livre/blob/main/screenshots/subcategory.png?raw=true"/>
</p>
<p>
    <img width="16%" src="https://github.com/LivreBooks/livre/blob/main/screenshots/bookviewer.png?raw=true"/>
    <img width="16%" src="https://github.com/LivreBooks/livre/blob/main/screenshots/library-tab.png?raw=true"/>
    <img width="16%" src="https://github.com/LivreBooks/livre/blob/main/screenshots/dowbload-viewer.png?raw=true" />
    <img width="16%" src="https://github.com/LivreBooks/livre/blob/main/screenshots/reader.png?raw=true"/>
    <img width="16%" src="https://github.com/LivreBooks/livre/blob/main/screenshots/reader-controls.png?raw=true"/>
</p>


## Feedback

If you have any feedback, please reach out on Twitter @PnTX10 or via Github discussions

## Contributing

Contributions are always welcome!

A lot of features can be added but I don't have the time for all of them so if you want to add something
just make a pull request

## Development

### Clone and install Dependancies
```bash
git clone https://github.com/LivreBooks/livre.git
cd livre
yarn
```
### Build Development build
```bash
yarn prebuild
npx expo run:android
```
