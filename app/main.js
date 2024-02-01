const loadInitialTemplate = () => {
	const template = `
		<h1>Animales</h1>
		<form id="animal-form">
			<div>
				<label>Nombre</label>
				<input name="name" />
			</div>
			<div>
				<label>Tipo</label>
				<input name="type" />
			</div>
			<button type="submit">Enviar</button>
		</form>
		<ul id="animal-list"></ul>
	`
	const body = document.getElementsByTagName('body')[0]
	body.innerHTML = template
}

const getAnimals = async () => {
	const response = await fetch('/animals', {
		headers: {
			Authorization: localStorage.getItem('jwt')  //si se registro busca el token en el localstorage
		}
	})
	const animals = await response.json()
	const template = animal => `
		<li>
			${animal.name} ${animal.type} <button data-id="${animal._id}">Eliminar</button>
		</li>
	`

	const animalList = document.getElementById('animal-list')
	animalList.innerHTML = animals.map(animal => template(animal)).join('')
	animals.forEach(animal => {
		animalNode = document.querySelector(`[data-id="${animal._id}"]`)
		animalNode.onclick = async e => {
			await fetch(`/animals/${animal._id}`, {
				method: 'DELETE',
				headers: {
					Authorization: localStorage.getItem('jwt')
				}
			})
			animalNode.parentNode.remove()
			alert('Eliminado con éxito')
		}
	})
}

const addFormListener = () => {
	const animalForm = document.getElementById('animal-form')
	animalForm.onsubmit = async (e) => {
		e.preventDefault()
		const formData = new FormData(animalForm)
		const data = Object.fromEntries(formData.entries())
		await fetch('/animals', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Authorization: localStorage.getItem('jwt')  //si se registro busca el token en el localstorage
			}
		})
		animalForm.reset()
		getAnimals()
	}
}

const loadLoginTemplate = () => {
	const template = `
		<h1>Login</h1>
		<form id="login-form">
			<div>
				<label>Email</label>
				<input name="email" />
			</div>
			<div>
				<label>Password</label>
				<input name="password" />
			</div>
			<button type="submit">Enviar</button>
		</form>
		<a href="#" id="register">Register</a>
		<div id="error">
		</div>
	`
	const body = document.getElementsByTagName('body')[0]
	body.innerHTML = template
}

//loguearse
const addLoginListener = () => {
	const loginForm = document.getElementById('login-form')
	loginForm.onsubmit = async (e) => {
		e.preventDefault()
		const formData = new FormData(loginForm)
		const data = Object.fromEntries(formData.entries())

		const response = await fetch('/login', {
			method:'POST',
			body:JSON.stringify(data),
			headers:{
				'Content-Type': 'application/json'
			}
		})
		const responseData = await response.text()
		if(response.status >= 300){
			const errorNode = document.getElementById('error')
			errorNode.innerHTML = responseData
		}else{
			console.log(responseData)
			localStorage.setItem('jwt', `Bearer ${responseData}`)
			animalsPage()
		}
	}
}

const goToRegisterListener = () => {
	const goToRegister = document.getElementById('register')
	goToRegister.onclick = (e) => {
		e.preventDefault()
		registerPage() // ir a una ruta particular
	}
}

const loadRegisterTemplate = () =>  {
	const template = `
		<h1>Reister</h1>
		<form id="register-form">
			<div>
				<label>Email</label>
				<input name="email" />
			</div>
			<div>
				<label>Password</label>
				<input name="password" />
			</div>
			<button type="submit">Enviar</button>
		</form>
		<a href="#" id="login">Iniciar secion</a>
		<div id="error">
		</div>
	`
	const body = document.getElementsByTagName('body')[0]
	body.innerHTML = template
}

//registrarse
const addRegisterListener = () => {
	const registerForm = document.getElementById('register-form')
	registerForm.onsubmit = async (e) => {
		e.preventDefault()
		const formData = new FormData(registerForm)
		const data = Object.fromEntries(formData.entries())

		const response = await fetch('/register', {
			method:'POST',
			body:JSON.stringify(data),
			headers:{
				'Content-Type': 'application/json'
			}
		})
		const responseData = await response.text()
		if(response.status >= 300){
			const errorNode = document.getElementById('error')
			errorNode.innerHTML = responseData
		}else{
			localStorage.setItem('jwt', `Bearer ${responseData}`)
			animalsPage()
		}
	}
}

const goToLoginListener = () => {
	const goToLogin = document.getElementById('login')
	goToLogin.onclick = (e) => {
		e.preventDefault()
		loginPage() // ir a login
	}
}

const checkLogin = () => localStorage.getItem('jwt')

const animalsPage = () =>{
	loadInitialTemplate()
	addFormListener()
  	getAnimals()
}

const loginPage = () =>{
	loadLoginTemplate()
	addLoginListener()
	goToRegisterListener() //lleva al registro
}

const registerPage = () =>{
	console.log('pagina registro')
	loadRegisterTemplate()
	addRegisterListener()
	goToLoginListener() //lleva a la pagina de login
}

window.onload = () => {
	const isLoggedIn = checkLogin()
	if(isLoggedIn){
		animalsPage()
	}else{
		loginPage()
	}
}
