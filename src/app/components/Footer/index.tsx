"use-client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  return (
    <footer className="bg-slate-900 rounded-lg shadow-sm dark:bg-gray-900 m-4 flex justify-center">
      <div className="w-1/3">
        <div>
          <img src="./logo-footer.png" alt="logo-footer" />
          <p>
            IT Learning với những khóa học cơ bản dễ tiếp cận với người mới học
            và trái ngành. Đào tạo chuyên sâu với cái dự án thực tế
          </p>
        </div>
        <div>
          <h3>NHẬN TIN SỰ KIỆN VÀ KHUYẾN MÃI</h3>
          <p>
            IT Learning gửi các bạn các khóa học trực tuyến và chương trình
            Cyberlive hoàn toàn MIỄN PHÍ và các chương trình KHUYẾN MÃI hấp dẫn
            đến các bạn.
          </p>
          <div>
            <input
              type="email"
              placeholder="address@gmail.com"
              className="rounded-md mx-3"
            />
            <button
              type="button"
              className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
            >
              Đăng ký
            </button>
          </div>
          <div>
            <div className="flex m-2">
              <FontAwesomeIcon
                icon={faLocationDot}
                color="grey"
                width={20}
                height={20}
              />
              <span className="text-white">Cơ sở</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/3"></div>
      <div className="w-1/3"></div>
    </footer>
  );
}

export default Footer;
