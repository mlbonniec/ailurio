import { components } from '@octokit/openapi-types'
import { Octokit } from '@octokit/rest';
import axios from 'axios';
import pkg from '../../package.json';

export default class Github {
	private octokit: Octokit;
	private owner: string;
	private repo: string;
	
	constructor(owner: string, repo: string) {
		this.owner = owner;
		this.repo = repo;
		this.octokit = new Octokit({
			userAgent: `${pkg.name} v${pkg.version}`,
			auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
		});
	}
	
	public async getRepository(): Promise<components['schemas']['full-repository']> {
		const { data } = await this.octokit.rest.repos.get({
			owner: this.owner,
			repo: this.repo,
		});
		
		return data;
	}
	
	public async getLanguages(): Promise<components['schemas']['language']> {
		const { data } = await this.octokit.rest.repos.listLanguages({
			owner: this.owner,
			repo: this.repo
		});
		
		return data;
	}
	
	public async getContributorsCount(): Promise<number> {
		const { data } = await this.octokit.rest.repos.listContributors({
			owner: this.owner,
			repo: this.repo
		});

		return data.length;
	}
	
	public async getAvatar(owner: Exclude<components['schemas']['simple-user'], null>): Promise<Buffer> {
		const { data } = await axios.get(owner.avatar_url, { responseType: 'arraybuffer' });
		
		return data;
	}
}
