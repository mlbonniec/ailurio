import type { FastifyInstance, FastifyServerOptions, RequestGenericInterface } from 'fastify';
import languages from '@helpers/languages';
import Github from '@models/github';
import Generator from '@controllers/generator';
import type { components } from '@octokit/openapi-types'

interface RepositoryParams extends RequestGenericInterface {
	Params: {
		owner: string;
		repo: string;	
	}
}

export default async function (app: FastifyInstance, _opts: FastifyServerOptions): Promise<void> {
	app.get<RepositoryParams>('/:owner/:repo', async (request, reply) => {
		const { owner, repo } = request.params;
		const gh = new Github(owner, repo);

		const { 
			name,
			owner: _user,
			description,
			stargazers_count: stars,
			open_issues: issues,
			forks_count: forks,
		} = await gh.getRepository();
		
		// TODO: Fix Github / TS typing error
		const user = _user as Exclude<components['schemas']['simple-user'], null>
		
		// TODO: Request all other pages, because it returns only 30 contributors per page
		// const contributors = await gh.getContributorsCount();
		const languagesList = await gh.getLanguages();
		const avatar = await gh.getAvatar(user);

		const img = new Generator({
			author: user.login,
			repository: name,
			description: description || '',
			languages: languages(languagesList),
			avatar,
			data: {
				// contributors,
				issues,
				forks,
				stars
			}
		});
		await img.init();

		reply.type('image/png');
		reply.send(img.canvas.toBuffer());
	});
};
