import { Button } from "@/components/ui/button";
import React from "react";
import { NavLink } from "react-router";


// youtube, x, instagram, linkedin
const spaces = [
    {
        id: 1,
        name: "youtube",
        icon: "YT",
        redirectUrl: "/spaces/youtube",
    },
    {
        id: 2,
        name: "x",
        icon: "X",
        redirectUrl: "/spaces/x",
    },
    {
        id: 3,
        name: "instagram",
        icon: "IG",
        redirectUrl: "/spaces/instagram",
    },
    {
        id: 4,
        name: "linkedin",
        icon: "LI",
        redirectUrl: "/spaces/linkedin",
    },
];

const Home = () => {
  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold">Welcome to Proxlay</h1>
      </div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum fuga quas,
      necessitatibus assumenda, rerum qui eligendi dolorem facilis eveniet id
      magnam veritatis, veniam quasi adipisci et enim. Non, ratione illo.
      <div className="flex flex-col items-center mt-5">
        <div className="flex justify-between items-center w-full max-w-2xl">
          <h2 className="text-2xl font-semibold">Spaces</h2>
          <Button>Create Space</Button>
        </div>
<div className="w-full max-w-2xl mt-4">
    {
        spaces.map((space) => (
            <div
                key={space.id}
                className="flex items-center justify-between p-4 border-b"
            >
                <NavLink to={space.redirectUrl} className="flex items-center">
                <span className="text-2xl font-bold">{space.icon}</span>
                <span className="ml-2 text-lg">{space.name}</span>
                </NavLink>
                <Button variant="outline">Join</Button>
            </div>
            ))
    }
    </div>      </div>
    </div>
  );
};

export default Home;
