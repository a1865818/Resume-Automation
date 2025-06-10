const PersonalPicture = ({PersonalPictureLink}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        //if personal picture is provided, use it, otherwise use a default image
        backgroundImage: PersonalPictureLink ? `url(${PersonalPictureLink})` : "url(/api/placeholder/400/600)",
       
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    ></div>
  );
};

export default PersonalPicture;