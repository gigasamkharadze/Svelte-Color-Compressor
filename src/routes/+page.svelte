<script>
	import { Image } from "image-js"
	import  KMeans from "kmeans-js"
	import { srcVariable } from './store.js';
	import bg from '../images/uploader.png';
	let image;
	let uploaded = false;
	let compressing = false;

	async function loadImage (event) {
		const file = event.target.files[0];
		const url = URL.createObjectURL(file);

		image = await Image.load(url);
		uploaded = true;
		srcVariable.set(url);
	}

	async function image_compress(image){
		compressing = true;
		const kmeans = new KMeans();
		const width = image.width;
		const height = image.height;
		const pixels = image.getPixelsArray();

		const clusters = kmeans.cluster(pixels, {
			maxIter: 20,
			distanceFunction: KMeans.EUCLIDEAN_DISTANCE,
			initFunction: KMeans.KMEANS_PLUS_PLUS_INIT
		});

		const new_pixels = pixels.map((pixel) => {
			let closest;
			let closest_distance = Infinity;
			for (let i = 0; i < clusters.length; i++) {
				const cluster = clusters[i];
				const distance = Math.sqrt(
					Math.pow(cluster[0] - pixel[0], 2) +
					Math.pow(cluster[1] - pixel[1], 2) +
					Math.pow(cluster[2] - pixel[2], 2)
				);
				if (distance < closest_distance) {
					closest = i;
					closest_distance = distance;
				}
			}
			return clusters[closest]
		});

		const new_image = new Image(width, height, {kind: "RGB"});
		new_image.data = new_pixels.flat();
		const url = await new_image.toDataURL();
		srcVariable.set(url);
		compressing = false;
	}
</script>

<!-- svelte-ignore a11y-img-redundant-alt -->
<div class="container bg-white w-5/6 h-3/4 md:w-3/4 border border-transparent rounded-[50px] p-3">
	<div class="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-[50px] py-2 gap-3">
		<img src={$srcVariable} alt="uploaded image" class="w-5/6 sm:w-3/4 md:w-1/2: h-5/6 object-contain" />
		{#if uploaded == false}
		<div class="flex flex-row font-semibold text-gray-500 font-raleway">
			<div class="mr-1">
				<label for="file-upload" class="cursor-pointer text-blue-500 font-bold">Upload</label>
				<input id="file-upload" type="file" accept="image/*" class="hidden" on:change={loadImage}>
			</div>			
			your image to compress
		</div>
		{:else}
		<div class="font-semibold text-gray-500 font-raleway">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<span 
			on:click={image_compress(image)}
			class="cursor-pointer text-blue-500 font-bold">Compress</span> 
			the image or 
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<span
			on:click={() => {
				uploaded = false;
				srcVariable.set(bg);
			}}
			class="cursor-pointer text-red-500 font-bold"
			> Remove </span>
			it
		</div>
		{/if}
		
		{#if compressing}
		<div class="font-semibold text-gray-500 font-raleway">
			Compressing...
		</div>
		{/if}

	</div>
</div>


<style lang="postcss">
	* {
		box-sizing: border-box;
	}

	:global(html, body) {
		height: 100%;
		margin: 0;
	}

	:global(body) {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #e7eff1;
	}

  </style>