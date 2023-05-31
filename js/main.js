document.addEventListener("DOMContentLoaded", () => {
	/** Creamos las diferentes variables para seleccionar los elementos del documento, 
	 * ejemplo el contenedor de la lista de clasificaciones, contenedor de las cartas, botones ... */
	const listClasifications = document.querySelector(".funcionarios__list");
	const listCardFuncionarios = document.querySelector(".funcionarios__wraper");
	const buttonHideItems = document.querySelector(".funcionarios__vermenos");
	const inputSearch = document.querySelector(".funcionarios__input");
	/** Creamos un arreglo tipo SET para ingresar valores unicos, ademas de varios arreglos globales 
	 * para guardar los resultados de la busqueda */
	let allCategories = new Set();
	let data = [];
	let dataGlobal = [];
	let valueInput = "";

	/** Capturamos el valor del input mediante el evento input y lo guardamos en la variable valueInput */
	function captureValueInput(e) {
		valueInput = e.target.value;
	}

	/** Evento click para el botón de buscar */
	function handleClickSearch(e) {
		e.preventDefault();
		BuscarFuncionarios(valueInput);
	}

	/** Evento keypres para buscador */
	function handleKeyPressSearch(e) {
		if (e.keyCode === 13) {
			e.preventDefault();
			BuscarFuncionarios(valueInput);
		}
	}

	/** Funcion asincrona para buscar en la biblioteca funcionarios toda la información y pintarla en pantalla */
	async function ConsultaFuncionarios() {
		const module = "NuestraAlcaldia/Dependencias",
			folder = "Funcionarios",
			params = ["ID",
				"LinkFilename",
				"Nombre_x0020_del_x0020_Funcionario",
				"Direccion",
				"Cargo",
				"Correo",
				"Celular",
				"Fecha_x0020_de_x0020_Posesi_x00f3_n",
				"Url",
				"Clasificacion",
				"Orden"];

		let ulrFetch = `${location.protocol}//${location.host}/${module}/_api/web/lists/getbytitle('${folder}')/items?$select=${params}&$orderby=Orden%20asc&`;

		try {
			let data = await fetch(ulrFetch, {
				method: "GET",
				headers: {
					Accept: "application/json; odata=verbose",
				},
			});
			let resp = await data.json();
			let info = resp.d.results
			dataGlobal = info;
			imprimirFuncionarios(info);
		} catch (error) {
			console.log(`error en consulta ${error}`);
		}
		createAllCategories();
	};

	/** Funcion que recibe el valor del input para buscar en la biblioteca funcionarios toda la información y pintarla en pantalla */
	function BuscarFuncionarios(valueInput) {
		inputSearch.value = "";
		let strurl = location.protocol + "//" + location.host + "/NuestraAlcaldia/Dependencias/_api/web/lists/getbytitle('Funcionarios')/items?$select=Title,LinkFilename,Nombre_x0020_del_x0020_Funcionario,FileLeafRef,Direccion,Cargo,Correo,Celular,Fecha_x0020_de_x0020_Posesi_x00f3_n,Url,Clasificacion&$top=2000&$filter=substringof('" + valueInput + "',Nombre_x0020_del_x0020_Funcionario) or substringof('" + valueInput + "',Cargo)or substringof('" + valueInput + "',Clasificacion)";
		$.ajax({
			url: strurl,
			method: "GET",
			headers: { "Accept": "application/json; odata=verbose" },
			success: function (data) {
				let info = data.d.results;
				if (info.length > 0) {
					imprimirFuncionarios(info);
				} else {
					errorSearch();
				}
			},
			error: errorFuncionarios
		});
	}

	/** Funcion de error */
	function errorFuncionarios(error) {
		console.error(error);
	}

	/** Funcion de error */
	function errorSearch() {
		inputSearch.classList.add("funcionarios__input--error");
		inputSearch.setAttribute("placeholder", "Valor no encontrado");
		document.querySelector("")
		console.error("Valor no encontrado")
		setTimeout(() => {
			inputSearch.classList.remove("funcionarios__input--error");
			inputSearch.setAttribute("placeholder", "Que desea Buscar");
		}, 5000)
	}

	/** Funcion para imprimir los resultados */
	function imprimirFuncionarios(info) {
		let fragmentContent = document.createDocumentFragment();
		listCardFuncionarios.innerHTML = "";
		inputSearch.classList.remove("funcionarios__input--error");
		data = info;

		for (const i in data) {
			const {
				LinkFilename,
				Nombre_x0020_del_x0020_Funcionario: name,
				Direccion,
				Cargo,
				Correo,
				Celular,
				Fecha_x0020_de_x0020_Posesi_x00f3_n: fecha,
				Url,
				Clasificacion } = data[i];

			const cardItem = document.createElement("div");
			cardItem.classList.add("funcionarios__card");

			const infoItem = document.createElement("div");
			infoItem.classList.add("funcionarios__info");
			infoItem.innerHTML =
				`<span class="funcionarios__fecha"><i class="fa fa-calendar" aria-hidden="true"></i> ${fecha}</span>
                <span class="funcionarios__clasificacion"><i class="fa fa-check" aria-hidden="true"></i> ${Clasificacion}</span>
                <span class="funcionarios__nombre"><i class="fa fa-user" aria-hidden="true"></i> ${name}</span>`;

			const containerImg = document.createElement("figure");
			containerImg.classList.add("funcionarios__contenedorIMG");

			containerImg.innerHTML = `<img class="funcionarios__img" src="/NuestraAlcaldia/Dependencias/Funcionarios/${LinkFilename}" alt="${Cargo}"></img>`

			const infoItemBottom = document.createElement("div");
			infoItemBottom.classList.add("funcionarios__info");
			infoItemBottom.classList.add("funcionarios__info--2");

			infoItemBottom.innerHTML =
				`<span class="funcionarios__cargo"><i class="fa fa-briefcase" aria-hidden="true"></i> ${Cargo}</span>
                <a class="funcionarios__correo" href="mailto:${Correo}"><i class="fa fa-envelope" aria-hidden="true"></i> ${Correo}</a>
                <span class="funcionarios__direccion"><i class="fa fa-home" aria-hidden="true"></i> ${Direccion}</span>
                <span class="funcionarios__telefono"><i class="fa fa-mobile" aria-hidden="true"></i> ${Celular}</span>`

			const infoLink = document.createElement("a");
			infoLink.classList.add("funcionarios__link");
			infoLink.href = Url;
			infoLink.innerHTML = `<i class="fa fa-id-card" aria-hidden="true"></i> Ver Hoja de vida`;

			cardItem.appendChild(infoItem);
			cardItem.appendChild(containerImg);
			cardItem.appendChild(infoItemBottom);
			cardItem.appendChild(infoLink);
			fragmentContent.appendChild(cardItem);
			allCategories.add(Clasificacion);
		}

		listCardFuncionarios.appendChild(fragmentContent);

		hideItems();
		return data;
	}

	/** Funcion para pintar las categorias */
	function createAllCategories() {
		let fragmentCategories = document.createDocumentFragment();
		allCategories.forEach(categorie => {
			let itemCategorie = document.createElement("li");
			itemCategorie.classList.add("funcionarios__li");
			itemCategorie.textContent = categorie;
			fragmentCategories.appendChild(itemCategorie);
		})
		listClasifications.appendChild(fragmentCategories);
	}

	/** Evento click al momento de elegir una categoria y filtar el arreglo global */
	function handleClickFilterCategorie(type) {
		const textInitial = "Todas las categorias";
		let info = [...dataGlobal];
		let filter = info.filter(el => el.Clasificacion === type);
		imprimirFuncionarios(filter);
		if (type === textInitial) imprimirFuncionarios(dataGlobal);
		hideItems();
	}

	/** Función para ocultar inicialmente si hay mas de 6 cartas en pantalla */
	function hideItems() {
		if (data.length > 6) {
			const allItems = [...document.querySelectorAll(".funcionarios__card")];
			let arrayItemsHide = [];
			for (let i = 6; i < allItems.length; i++) {
				arrayItemsHide.push(allItems[i]);
			}
			arrayItemsHide.forEach(item => item.classList.add("funcionarios__card--hide"))
		}
	}

	/** Función de evento click para mostrar de 2 en 2 las cartas ocultas */
	function handleShowItems() {
		const allItems = document.querySelectorAll(".funcionarios__card--hide");
		if (allItems) {
			for (let i = 0; i < 2; i++) {
				allItems[i].classList.remove("funcionarios__card--hide");
			}
		}
		buttonHideItems.classList.add("funcionarios__vermenos--active");
	}

	/** Función de evento click para ocultar de 2 en 2 las cartas ocultas */
	function handleHideItems() {
		const allItems = [...document.querySelectorAll(".funcionarios__card:not(.funcionarios__card--hide)")].reverse();
		if (allItems.length === 8) buttonHideItems.classList.remove("funcionarios__vermenos--active");
		if (allItems) {
			for (let i = 0; i < 2; i++) {
				allItems[i].classList.add("funcionarios__card--hide");
			}
		}
	}

	/** Llamamos funcion principal de consulta de biblioteca */
	ConsultaFuncionarios();

	/** Asignamos a sus respectivos elementos el evento click */
	document.addEventListener("click", (e) => {
		if (e.target.classList.contains("funcionarios__li")) handleClickFilterCategorie(e.target.textContent);
		if (e.target.classList.contains("funcionarios__vermas")) handleShowItems();
		if (e.target.classList.contains("funcionarios__vermenos")) handleHideItems();
		if (e.target.classList.contains("funcionarios__button")) handleClickSearch(e);
	})

	/** Asignamos al input el evento al momento de escribir y dar en el botón "enter" */
	inputSearch.addEventListener('input', (e) => captureValueInput(e));
	inputSearch.addEventListener('keypress', (e) => handleKeyPressSearch(e));
})
