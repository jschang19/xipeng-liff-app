interface Profile {
  userId: string;
  uuid?: string;
  displayName: string;
  pictureUrl: string;
  email: string | null;
  type: {
    staff: boolean;
    speaker: boolean;
  };
}

interface Event {
  id: string;
  title: string;
  place: string;
  startAt: number;
  endAt: number;
}

interface Stamp {
  id: string;
  type: "speaker" | "booth" | "empty";
  booth: {
    name: string;
    description: string;
    imageUrl: string;
    link: string;
  };
}

interface FullProfile extends Profile {
  uuid: string;
}

interface Option {
  label: string,
  value: String
};

interface Question {
  id: string,
  placeholder?: string,
  name: string,
  type: "select" | "long-text" | "input",
  question: string,
  required: boolean,
  options? : Array<Option>
};

export { Profile, FullProfile, Event, Stamp, Question, Option };
