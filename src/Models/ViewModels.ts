export namespace ViewModels {
  export class Question {
    public Id: number;
    public Title: string;
    public Description: string;
    public Likes: number;
    public AnswersCount: number;
    public Answers: Array<Answer>;
    public Tags: string;
    public Mentions: string;
    public Author: string;
    public Created: Date;

    constructor(args: any) {
      this.Id = args.Id || 0;
      this.Title = args.Title;
      this.Description = args.Description;
      this.Likes = args.Likes;
      this.AnswersCount = args.AnswersCount;
      this.Answers = args.Answers;
      this.Tags = args.Tags;
      this.Mentions = args.Mentions;
      this.Author = args.Author;
      this.Created = args.Created;
    }
  }

  export class Answer {
    public Id: number;
    public QuestionId: number;
    public Answer: string;
    public Likes: number;
    public Accepted: number;
    public Author: string;
    public Mentions: string;
    public Created: string;
    
    constructor(args: any) {
      this.Id = args.Id;
      this.QuestionId = args.QuestionId;
      this.Answer = args.Answer;
      this.Likes = args.Likes;
      this.Accepted = args.Accepted;
      this.Author = args.Author;
      this.Mentions = args.Mentions;
      this.Created  = args.Created;

    }

  }
}
