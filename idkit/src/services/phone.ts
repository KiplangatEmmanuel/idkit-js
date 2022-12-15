import type { IPhoneSignal } from '@/types'

const API_BASE_URL = 'https://developer.worldcoin.org/api/v1'

export async function requestCode(phone_number: string, action_id: string, ph_distinct_id: string): Promise<void> {
	const res = await post('/phone/request', {
		phone_number,
		action_id,
		channel: 'sms', // FIXME
		ph_distinct_id,
	})

	if (!res.ok) throw await res.json()
}

export async function verifyCode(
	phone_number: string,
	code: string,
	action_id: string,
	ph_distinct_id: string
): Promise<IPhoneSignal> {
	const res = await post('/phone/verify', {
		phone_number,
		code,
		action_id,
		ph_distinct_id,
	})
	if (!res.ok) throw await res.json()

	return res.json() as Promise<IPhoneSignal>
}

export interface RequestCodeError {
	code: 'max_attempts' | 'server_error' | 'timeout'
	details: string
}

export function isRequestCodeError(error: unknown): error is RequestCodeError {
	return (
		typeof error === 'object' &&
		error !== null &&
		Object.prototype.hasOwnProperty.call(error as Record<string, unknown>, 'code')
	)
}

export interface VerifyCodeError {
	code: 'invalid_code'
	details: string
}

export function isVerifyCodeError(error: unknown): error is VerifyCodeError {
	return (
		typeof error === 'object' &&
		error !== null &&
		Object.prototype.hasOwnProperty.call(error as Record<string, unknown>, 'code')
	)
}

const post = (path: string, body: Record<string, string>) =>
	fetch(`${API_BASE_URL}${path}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})
