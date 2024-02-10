export type AchievementPrimitive = {
    generationFunction : string, // function to generate valid input for the validation function and the user input function
    validationFunction : string, // function to test against, expect this functions output to equal the user input function to validate
    compareFunction : string, // function that will test the validate function against the user input function
    difficultyRating : number, // when creating the achievement, put a difficulty rating on it for easier sorting
    description : string, // description on the achievement task
    id:number,
}