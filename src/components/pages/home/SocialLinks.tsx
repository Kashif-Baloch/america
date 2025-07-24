import Image from "next/image";
import React from "react";

const SocialLinks = () => {
  return (
    <div className="helmet py-10 ">
      <div className="gap-10 justify-center flex flex-wrap">
        <a
          href="https://www.instagram.com/america.working/profilecard/?igsh=MWpoOTA2dHF3YjZkeQ%3D%3D"
          target="_blank"
          className="text-4xl inline-block"
        >
          <Image
            src={"/images/insta.svg"}
            alt=""
            height={800}
            width={800}
            className="sm:size-20 size-10"
          />
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=61576715676015"
          target="_blank"
          className="text-4xl inline-block"
        >
          <Image
            src={"/images/fb.svg"}
            alt=""
            height={800}
            width={800}
            className="sm:size-20 size-10"
          />
        </a>
        <a
          href="https://www.tiktok.com/@america.working?_t=ZT-8yAFCclSG4l&_r=1"
          target="_blank"
          className="text-4xl inline-block"
        >
          <Image
            src={"/images/tiktok.svg"}
            alt=""
            height={800}
            width={800}
            className="sm:size-20 size-10"
          />
        </a>
      </div>
    </div>
  );
};

export default SocialLinks;
