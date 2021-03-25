import "./App.css";

export default function ProfileButton( {profileInfo}) {
      return (
      <>
        <a href={"/"+profileInfo.username} className="purple-btn">{profileInfo.username}</a>  
      </>
  );
}
