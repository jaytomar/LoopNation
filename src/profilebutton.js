import "./App.css";

export default function ProfileButton( {profileInfo}) {
      return (
      <>
        <a href={`${process.env.PUBLIC_URL}/${profileInfo.username}`} className="purple-btn">{profileInfo.username}</a>  
      </>
  );
}
