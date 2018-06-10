import { ViewModels } from "../Models/ViewModels";

export class DataService {
  public User: ViewModels.User = new ViewModels.User({
            UserId: "asah@saketadev.onmicrosoft.com",
            Name: "avinash"
          });

  public updateUserData = (userData: any):void => {
    this.User = new ViewModels.User({
      UserId: userData.userPrincipalName,
      Name: userData.displayName
    })
  }
  public GetQuestions = (): Promise<Array<ViewModels.Question>> => {
    return new Promise<Array<ViewModels.Question>>(
      (
        resolve: (Questions: Array<ViewModels.Question>) => void,
        reject: (error: any) => void
      ): void => {
        fetch("http://catalystwebap.azurewebsites.net/api/questions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(reponseJson => {
            debugger;
            var data = JSON.parse(reponseJson);
            var Questions = new Array<ViewModels.Question>();
            data.forEach((elem : any) => {
              var ques = new ViewModels.Question({
                Id: elem.ID,
                Title: elem.Title,
                Description: elem.Description,
                Likes: elem.Likes,
                AnswersCount: elem.AnswersCount,
                Tags: elem.Tags,
                UserID: elem.UserID,
                Author: elem.Author == '' ? "test" : elem.Author,
                Mentions: elem.Mentions,
                Created: elem.Created
              });
              Questions.push(ques);
            });
            resolve(Questions);
          })
          .catch(error => {});
      }
    );
  };

  public GetSelectedQuestion = (questionId: number): Promise<ViewModels.Question> => {
    return new Promise<ViewModels.Question>((resolve: (Questions: ViewModels.Question) => void, reject: (error: any) => void): void => {
        fetch("http://catalystwebap.azurewebsites.net/api/questions/"+ questionId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => response.json())
        .then(reponseJson => {
          debugger;
          var data = JSON.parse(reponseJson);
          var answers = Array<ViewModels.Answer>();
          if(data.Answers && data.Answers.length > 0)
          {
            data.Answers.forEach((elem : any) => {
              var ans = new ViewModels.Answer({
                Id: elem.ID,
                Answer: elem.Answer,
                Likes: elem.Likes,
                Accepted: elem.Accepted,
                Author: elem.Author,
                Mentions: elem.Mentions,
                Created: elem.Created
              });
              answers.push(ans);
            });
          }
          var ques = new ViewModels.Question({
            Id: data.ID,
            Title: data.Title,
            Description: data.Description,
            Likes: data.Likes,
            AnswersCount: data.AnswersCount,
            Answers: answers,
            Tags: data.Tags,
            Author: data.Author,
            Mentions: data.Mentions,
            Created: data.Created
          });
          resolve(ques);
        })
        .catch(error => {});
      }
    );
  };
  public AddQuestion = (question: ViewModels.Question): Promise<boolean> => {
    return new Promise<boolean>((resolve: (isAdded: boolean) => void, reject: (error: any) => void): void => {
        fetch("http://catalystwebap.azurewebsites.net/api/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "Title":question.Title,
            "Description":question.Description,
            "Likes":0,
            "Tags":question.Tags,
            "Author":question.Author,
            "Mentions":question.Mentions
          })
        })
        .then(response => response.json())
        .then(reponseJson => {
            resolve(reponseJson);
        })
        .catch(error => {});
      }
    );
  };

  public AddNewAnswer = (question: ViewModels.Question, newAnswer: ViewModels.Answer): Promise<Array<ViewModels.Answer>> => {
    debugger;
    return new Promise<Array<ViewModels.Answer>>((resolve: (updatedAnswers: Array<ViewModels.Answer>) => void, reject: (error: any) => void): void => {
        fetch("http://catalystwebap.azurewebsites.net/api/answers/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "QuestionID" : question.Id,
            "Accepted": 0,
            "Author" : this.User.Name,
            "Mentions": "You and You",
            "Answer": newAnswer.Answer
          })
        })
        .then(response => response.json())
        .then(reponseJson => {
            resolve(reponseJson);
        })
        .catch(error => {});
      }
    );
  };

  public LikeAQuestion = (ques: ViewModels.Question): Promise<ViewModels.Question> => {
    return new Promise<ViewModels.Question>((resolve: (updatedQuestions: ViewModels.Question) => void, reject: (error: any) => void): void => {
        fetch("http://catalystwebap.azurewebsites.net/api/Questions/like", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "ID": ques.Id,
            "UserID": this.User.UserId,
            "UserName": this.User.Name
          })
        })
        .then(response => response.json())
        .then(reponseJson => {
            resolve(reponseJson);
        })
        .catch(error => {});
      }
    );
  };
  public LikeAnAnswer = (answer: ViewModels.Answer): Promise<ViewModels.Answer> => {
    return new Promise<ViewModels.Answer>((resolve: (updatedQuestions: ViewModels.Answer) => void, reject: (error: any) => void): void => {
        fetch("http://catalystwebap.azurewebsites.net/api/Questions/like", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "ID": answer.Id,
            "UserID": this.User.UserId,
            "UserName": this.User.Name
          })
        })
        .then(response => response.json())
        .then(reponseJson => {
            resolve(reponseJson);
        })
        .catch(error => {});
      }
    );
  };
}

export default new DataService();
