import React from "react";

type TeamHeaderProps = {
    team1: string;
    team2: string;
};

const TeamHeader: React.FC<TeamHeaderProps> = ({ team1, team2 }) => (
    <div className="w-full bg-gray-500 border-black border-y-2 h-[100px] flex flex-row justify-between items-center px-10">
        <h1>{team1}</h1>
        <h1 className="text-2xl">0 - 0</h1>
        <h1>{team2}</h1>
    </div>
);

export default TeamHeader;
