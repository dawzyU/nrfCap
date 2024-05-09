<template>
	<div class="flex-col text-white text-center mt-12">
		<img src="./assets/logos/logo.png" class="mx-auto" />
		<h1 class="text-2xl mt-3">Naixes Led Test</h1>
		<div v-if="!bluetoothConnected" class="mt-20">
			<Button label="Connexion" @click="BleConnexion" />
		</div>
		<div v-else class="mt-10">
			<div class="flex items-center space-x-4 justify-center">
				<h1>LED :</h1>
				<InputSwitch v-model="led_toggle" @change="toggleLed" />
			</div>
			<div class="flex items-center space-x-4 justify-center mt-4">
				<h1>Button :</h1>
				<h1 :class="button === 'Pressed' ? 'text-green-500' : 'text-red-500'">{{ button }}</h1>
			</div>
			<div class="flex items-center space-x-4 justify-center mt-4">
				<Button label="Disconnect" @click="disconnect" />
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, onBeforeUnmount } from "vue"
	import { BleClient, numbersToDataView } from "@capacitor-community/bluetooth-le"

	const bluetoothConnected = ref(false)

	const lbs_service = "00001523-1212-efde-1523-785feabcd123"
	const led_uuid = "00001525-1212-efde-1523-785feabcd123"
	const button_uuid = "00001524-1212-efde-1523-785feabcd123"

	const led_toggle = ref(false)
	const button = ref("Released")

	var device = null

	// Function for disconnecting
	function onDisconnect(deviceId) {
		console.log("device disconnected", deviceId)
	}

	async function disconnect() {
		await BleClient.disconnect(device.deviceId)
		bluetoothConnected.value = false
	}

	async function toggleLed() {
		if (led_toggle.value === false) {
			// turn off the LED
			const offValue = numbersToDataView([0])
			await BleClient.write(device.deviceId, lbs_service, led_uuid, offValue)
		} else {
			// turn on the LED
			const onValue = numbersToDataView([1])
			await BleClient.write(device.deviceId, lbs_service, led_uuid, onValue)
		}
	}

	async function BleConnexion() {
		await BleClient.initialize()
		device = await BleClient.requestDevice({
			services: [lbs_service],
		})
		// connect to device, the onDisconnect callback is optional
		await BleClient.disconnect(device.deviceId)
		await BleClient.connect(device.deviceId, (deviceId) => onDisconnect(deviceId))

		await BleClient.startNotifications(device.deviceId, lbs_service, button_uuid, (value) => {
			if (value.getUint8(0) === 0) {
				button.value = "Released"
			} else {
				button.value = "Pressed"
			}
		})
		bluetoothConnected.value = true
	}

	onBeforeUnmount(async () => {
		await toggleLed()
		await BleClient.disconnect(device.deviceId)
	})
</script>

<style>
	body {
		background-color: #1e2128;
	}
</style>
