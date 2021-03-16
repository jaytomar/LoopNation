import "./App.css";
export default function Search() {
  return (
      <div >
        <form action="" className="search-module">
          <input type="text" className="search-bar" />
          <div className="genre-select">
            <select id="myList" name="genre">
              <option value="none" selected disabled hidden>
                Genre
              </option>
              <option value="1">Trap</option>
              <option value="2">Hip-Hop</option>
              <option value="3">House</option>
              <option value="4">Jazz</option>
            </select>
          </div>
          <input className="submit-btn" type="button" value="search" />
        </form>
      </div>
  );
}

