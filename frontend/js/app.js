import { getRecommendation } from "./api.js"
const startBtn = document.getElementById('start_btn');
const startView = document.getElementById('start-view');
const phoneContainer = document.getElementById('phone-container');
let totalPeople = 0;
let personNumber = 1;
let answersArray = [];
let moodOne = '';
let mood = '';
document.addEventListener('click', async (e) => {
    if (e.target.id === 'start_btn') {
        const peopleCount = document.getElementById('input-people')
        totalPeople = Number(peopleCount.value)
        startView.classList.remove('active');
        questionScrean();
        const questionView = document.getElementById('questions-view');
        questionView.classList.add('active');
    }
    const newBtn = document.getElementById('new_btn');
    const classicBtn = document.getElementById('classic_btn');
    const funBtn = document.getElementById('fun_btn');
    const seriousBtn = document.getElementById('serious-btn');
    const inspiringBtn = document.getElementById('inspiring_btn');
    const scaryBtn = document.getElementById('scary_btn');
    if (e.target.id === 'new_btn') {
        newBtn.classList.add('selected');
        classicBtn.classList.remove('selected');
        moodOne = 'new'
    } else if (e.target.id === 'classic_btn') {
        newBtn.classList.remove('selected');
        classicBtn.classList.add('selected');
        moodOne = 'classic';
    }

    if (e.target.id === 'fun_btn') {
        funBtn.classList.add('selected');
        seriousBtn.classList.remove('selected');
        inspiringBtn.classList.remove('selected');
        scaryBtn.classList.remove('selected');
        mood = 'fun';

    } else if (e.target.id === 'serious-btn') {
        funBtn.classList.remove('selected');
        seriousBtn.classList.add('selected');
        inspiringBtn.classList.remove('selected');
        scaryBtn.classList.remove('selected');
        mood = 'serious';

    } else if (e.target.id === 'inspiring_btn') {
        funBtn.classList.remove('selected');
        seriousBtn.classList.remove('selected');
        inspiringBtn.classList.add('selected');
        scaryBtn.classList.remove('selected');
        mood = 'inspiring';

    } else if (e.target.id === 'scary_btn') {
        funBtn.classList.remove('selected');
        seriousBtn.classList.remove('selected');
        inspiringBtn.classList.remove('selected');
        scaryBtn.classList.add('selected');
        mood = 'scary';
    }
    const movie = document.querySelector('.preferd-movie');
    const actor = document.querySelector('.preferd-actor');
    let personAnswers = {
        favouriteMovie: '',
        moodOne: '',
        mood: '',
        actor: ''
    };

    if (e.target.id === 'question-action-btn') {

        const questionView = document.getElementById('questions-view');
        if (personNumber < totalPeople) {
            personNumber++;
            questionScrean();
            const questionView = document.getElementById('questions-view');
            personAnswers = {
                favouriteMovie: movie.value,
                moodOne: moodOne,
                mood: mood,
                actor: actor.value
            }
            answersArray.push(personAnswers);
            questionView.classList.add('active');
        } else {
            questionView.classList.remove('active');
            personAnswers = {
                favouriteMovie: movie.value,
                moodOne: moodOne,
                mood: mood,
                actor: actor.value
            }
            answersArray.push(personAnswers);
            const combinedInput = answersArray.map((ans, idx) =>
                `Person ${idx + 1}: Favorite: ${ans.favouriteMovie},Prefer: ${ans.moodOne} Movies, Mood: ${ans.mood}, Preference: ${ans.actor}`
            ).join('\n')

            const apiPayload = {
                favouriteMovie: answersArray[0]?.favouriteMovie || '',
                genre: answersArray[0]?.moodOne || 'new',
                mood: answersArray[0]?.mood || 'fun',
                preference: answersArray.map(a => a.actor).join(', ')
            }
            const result = await getRecommendation(apiPayload)
            console.log(result);
            resultsScrean(result);
            const OutputView = document.getElementById('output-view');
            OutputView.classList.add('active');
        }



    }

})


function questionScrean() {
    phoneContainer.innerHTML = `
      <div id="questions-view" class="view">
            <span class="logo-img" style="font-size: 40px; text-align: center; margin-bottom: 5px;">🍿</span>
            <div class="person-counter" id="current-person-idx"> ${personNumber} / ${totalPeople}</div>

            <div class="question-block">
                <div class="question-label">What's your favorite movie and why?</div>
                <textarea
                    class="preferd-movie" placeholder="e.g. The Shawshank Redemption. Because it taught me to never give up hope no matter how hard life gets."></textarea>
            </div>

            <div class="question-block">
                <div class="question-label">Are you in the mood for something new or a classic?</div>
                <div class="btn-row">
                    <button class="pill-btn" id="new_btn">New</button>
                    <button class="pill-btn" id="classic_btn">Classic</button>
                </div>
            </div>

            <div class="question-block">
                <div class="question-label">What are you in the mood for?</div>
                <div class="btn-row">
                    <button class="pill-btn" id="fun_btn">Fun</button>
                    <button class="pill-btn" id="serious-btn">Serious</button>
                    <button class="pill-btn" id="inspiring_btn">Inspiring</button>
                    <button class="pill-btn" id="scary_btn">Scary</button>
                </div>
            </div>

            <div class="question-block">
                <div class="question-label">Which famous film person you like and why?</div>
                <textarea
                 class="preferd-actor"   placeholder="e.g. Tom Hanks because he is really funny and can do the voice of Woody."></textarea>
            </div>

            <button class="primary-btn next-btn" id="question-action-btn"> ${personNumber === totalPeople
            ? 'Recommend Movies'
            : 'Next Person'
        }</button>
        </div>
    `
}






function resultsScrean(results) {

    phoneContainer.innerHTML = `  <div id="output-view" class="view">
            <div class="movie-title" id="movie-title-element">The Martian (2015)</div>

            <div class="poster-container">
                <img id="movie-poster-element"
                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80"
                    alt="Movie Poster">
            </div>

            <p class="movie-description" id="movie-desc-element">
                The inspiring story of an astronaut stranded on Mars who needs to rely on his ingenuity to come back to
                Earth.
            </p>

            <button class="primary-btn" id="output-action-btn">Next Movie</button>
        </div>
        `

}
