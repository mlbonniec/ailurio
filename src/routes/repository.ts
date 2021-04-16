import type { Contributors, Languages, Repository } from 'types/github';
import { Router } from 'express'
import axios from 'axios';
import languages from '@helpers/languages';

const router = Router();

router.get('/:owner/:repo', async (req, res, next) => {
	const { owner, repo } = req.params;
	
	const { data: repository }: { data: Repository } = await axios(`https://api.github.com/repos/${owner}/${repo}`);
	const { 
		name,
		owner: { 
			login: username,
			avatar_url: avatar	
		},
		description,
		stargazers_count: stars,
		open_issues: issues,
		forks_count: forks,
		contributors_url,
		languages_url
	} = repository;
	
	const { data: contributorsList }: { data: Contributors } = await axios(contributors_url);
	const contributors = Object.keys(contributorsList).length;
	
	const { data: languagesList }: { data: Languages } = await axios(languages_url);
	
	res.send({
		name,
		avatar,
		username,
		description,
		stars,
		issues,
		forks,
		contributors,
		languages: languages(languagesList),
	});
});

export default router;
