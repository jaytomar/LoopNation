import "./App.css";

export default function ProfileButton( {profileInfo}) {
      return (
      <>
        <a href="/profile">{profileInfo.username}</a>  
      </>
  );
}
