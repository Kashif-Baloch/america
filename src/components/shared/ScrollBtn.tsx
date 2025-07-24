"use client";
import Image from "next/image";
import Link from "next/link";

const WHATSAPP_NUMBER = "13473227357"; // e.g. 923001234567

const ScrollBtn = () => {
  return (
    <>
      <div className={`fixed bottom-7 right-7 z-50 cursor-pointer`}>
        <Link
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          className="    relative "
        >
          <Image
            src={"/images/whatsapp.svg"}
            alt="Whatsapp"
            className={`size-16 pt-px drop-shadow-2xl  shake-pulse  left-0 top-0 transition-opacity duration-1000`}
            width={800}
            height={800}
            style={{ zIndex: 2 }}
          />
        </Link>
      </div>
    </>
  );
};

export default ScrollBtn;
