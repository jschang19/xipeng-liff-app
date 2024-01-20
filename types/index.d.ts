interface Profile {
    userId: string;
    displayName: string;
    pictureUrl: string;
    statusMessage?: string;
    email: string | null;
    access: "admin" | "booth" | "user";
    type:{
        staff: boolean;
        speaker: boolean;
    };
}

interface Event {
    id: string;
    title: string;
    type: "training" | "game";
    isOpen: boolean;
    repeatDay: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    createdBy: Profile;
    createdAt: string;
    startAt: string;
    scope: 0 | 1;
    place: string | null;
    endAt: string;
}

export { Profile, Event };