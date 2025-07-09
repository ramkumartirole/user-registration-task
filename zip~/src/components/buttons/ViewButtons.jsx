import React, { useState } from "react";

const ViewButtons = ({ orbitControlsRef, toggleRotate }) => {
  const [activeView, setActiveView] = useState("optionDefault");
  const [isRotating, setIsRotating] = useState(false);

  const setView = (position, target = [0, 0, 0], viewId) => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.object.position.set(...position);
      orbitControlsRef.current.target.set(...target);
      orbitControlsRef.current.update();
    }
    setActiveView(viewId);
  };

  const handleToggleRotate = () => {
    setIsRotating((prev) => !prev);
    toggleRotate();
  };

  return (
    <div className="z-3 position-absolute  p-1">
      <div className="row ">
        {/* Main view buttons */}
        <div className="col-12">
          <div className="d-flex flex-wrap justify-content-center gap-1">
            {[
              { id: "option1", label: "Front", icon: "bi-arrow-up", position: [0, 0, 6] },
              { id: "optionBack", label: "Back", icon: "bi-arrow-down", position: [0, 0, -6] },
              { id: "optionLeft", label: "Left", icon: "bi-arrow-left", position: [5, 0, 0] },
              { id: "optionRight", label: "Right", icon: "bi-arrow-right", position: [-5, 0, 0] },
              { id: "optionTop", label: "Top", icon: "bi-chevron-up", position: [0, 8, 0] },
              { id: "optionDefault", label: "Default", icon: "bi-house-fill", position: [-4, 3, -4.8] }
            ].map(({ id, label, icon, position }) => (
              <label
                key={id}
                className={`btn btn-sm  ${activeView === id ? "active btn-secondary text-white" : "btn-outline-secondary"}`}
                title={`Switch to  ${label} View`}
                style={{ minWidth: "90px", transition: "all 0.2s ease" }}
              >
                <input
                  type="radio"
                  name="options"
                  autoComplete="off"
                  className="btn-check"
                  onClick={() => setView(position, [0, 0, 0], id)}
                />
                <i className={`bi  ${icon} me-1`}></i>
                {label}
              </label>
            ))}
            <label
            className={`btn btn-sm  ${isRotating ? "active btn-secondary text-white" : "btn-outline-secondary"}`}
            title={isRotating ? "Exit 360 View" : "Toggle Rotate 360"}
            style={{ transition: "all 0.2s ease" }}
          >
            <input
              type="checkbox"
              className="btn-check"
              autoComplete="off"
              onClick={handleToggleRotate}
            />
            <i className="bi bi-arrow-repeat me-1"></i>
            {isRotating ? "Exit 360°" : "View 360°"}
          </label>
          </div>
        </div>

        {/* 360 View toggle button */}
        {/* <div className="col-12 d-flex justify-content-center">

        </div> */}
      </div>
    </div>
  );
};

export default ViewButtons;