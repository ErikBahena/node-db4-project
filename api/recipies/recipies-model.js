const db = require("../../data/db-config");

const findById = async (recipie_id) => {
  // get recipie information, step information, ingredient information related to a recipie
  const stepsArr = await db("recipies as r")
    .leftJoin("steps as s", "r.recipie_id", "s.recipie_id")
    .leftJoin("step_ingredients as si", "s.step_id", "si.step_id")
    .leftJoin("ingredients as i", "si.ingredient_id", "i.ingredient_id")
    .where("r.recipie_id", recipie_id)
    .select("i.*", "s.step_id", "s.step_instructions", "s.step_number", "r.*")
    .orderBy("s.step_number");

  const formatIngredients = (step_id) => {
    return stepsArr
      .map((step) => {
        if (step.ingredient_id === null) return;

        if (step.step_id === step_id)
          return {
            ingredient_id: step.ingredient_id,
            ingredient_name: step.ingredient_name,
            quantity: step.quantity ? step.quantity : "varied",
          };
      })
      .filter((step) => !!step);
  };

  return {
    recipie_id: stepsArr[0].recipie_id,
    recipie_name: stepsArr[0].recipie_name,
    created_at: stepsArr[0].created_at,
    steps: stepsArr.map((step) => {
      return {
        step_id: step.step_id,
        step_number: step.step_number,
        step_instructions: step.step_instructions,
        ingredients: formatIngredients(step.step_id),
      };
    }),
  };
};

module.exports = { findById };
