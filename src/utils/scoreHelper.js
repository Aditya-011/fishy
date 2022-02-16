const RoundTotal = () => {};

const CurrentRoundTotal = () => {
	let roundScore = [0, 0, 0, 0];
};

const totalScore = () => {};

/**
 *
 * @param {Array} scoreData round data
 * @returns {Array} updated scoreData
 */
const calculateScore = (scoreData) => {
	let currentRound = Object.keys(scoreData).length;
	console.log(scoreData);
	console.log(`Current Round ${currentRound}`);
	let choices = [];
	let res = {};
	choices[1] = 0;
	choices[2] = 0;
	let numberFish = []; // will hold current round score
	numberFish[1] = 0;
	numberFish[2] = 0;
	let newState = scoreData[currentRound]; // current round data
	for (let player in newState) {
		let currentChoice = Number(newState[player].isSubmit.choice);
		console.log(`Current choice of player ${player} is ${currentChoice}`);
		choices[currentChoice]++;
	}
	if (choices[1] === 2 && choices[2] === 0) {
		numberFish[1] = 250;
		numberFish[2] = 0;
	} /* else if (choices[1] === 3 && choices[2] === 1) {
		numberFish[1] = 0;
		numberFish[2] = 750;
	} */ else if (choices[1] === 1 && choices[2] === 1) {
		numberFish[1] = -125;
		numberFish[2] = 500;
	} /* else if (choices[1] === 1 && choices[2] === 3) {
		numberFish[1] = -250;
		numberFish[2] = 250;
	} */ else if (choices[1] === 0 && choices[2] === 2) {
		numberFish[1] = 0;
		numberFish[2] = -250;
	}
	if (currentRound === 5) {
		numberFish = numberFish.map((n) => n * 3);
	} else if (currentRound === 8) {
		numberFish = numberFish.map((n) => n * 5);
	} else if (currentRound === 10) {
		numberFish = numberFish.map((n) => n * 10);
	}
	// upadte the score
	for (let player in newState) {
		let currentChoice = Number(newState[player].isSubmit.choice);
		if (currentChoice === 0) newState[player].indivScore = 0;
		else newState[player].indivScore = numberFish[currentChoice];
	}
	console.log(newState);
	console.log(choices);
	console.log(numberFish);

	scoreData[currentRound] = newState;

	console.log(scoreData);

	return scoreData;
};

export { calculateScore };
