import "./App.css";

export default function ProfileButton( {profileInfo}) {
      return (
      <>
        <a href={"/LoopNation/#/"+profileInfo.username} className="purple-btn">{profileInfo.username}</a>  
      </>
  );
}
