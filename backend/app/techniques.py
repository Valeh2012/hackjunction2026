"""Technique classes the API can report.

The list follows the 14 classes of SemEval-2020 Task 11 (propaganda technique
classification). Edit it here if the models are trained on a different label set.
The web app keeps no list of its own: it reads this one from `GET /api/techniques`
and shows each `name` and `description` as written here.
"""

TECHNIQUES: list[dict[str, str]] = [
    {
        "id": "loaded_language",
        "name": "Loaded Language",
        "description": (
            "Emotionally charged words can steer a reaction before a claim is "
            "examined. Strong language can also be justified by context."
        ),
    },
    {
        "id": "name_calling_labeling",
        "name": "Name Calling, Labeling",
        "description": (
            "A derogatory label may replace an argument about a person or group. A "
            "quoted or challenged insult is not necessarily an endorsement."
        ),
    },
    {
        "id": "repetition",
        "name": "Repetition",
        "description": (
            "Repeating a word or phrase can make an idea feel established. "
            "Repetition is also a normal rhetorical device, not always manipulative."
        ),
    },
    {
        "id": "exaggeration_minimisation",
        "name": "Exaggeration, Minimisation",
        "description": (
            "Hyperbole can inflate a threat; minimization can downplay harm. Both "
            "can distort scale, though they can also be honest emphasis."
        ),
    },
    {
        "id": "doubt",
        "name": "Doubt",
        "description": (
            "Questioning established facts or sources can undermine trust without "
            "offering evidence. Genuine questioning is not the same as casting "
            "baseless doubt."
        ),
    },
    {
        "id": "appeal_to_fear_prejudice",
        "name": "Appeal to Fear/Prejudice",
        "description": (
            "A threat or alarming consequence can pressure readers to agree, and "
            "prejudice can be activated against a group. A legitimate warning can "
            "use the same wording."
        ),
    },
    {
        "id": "flag_waving",
        "name": "Flag-Waving",
        "description": (
            "Invoking national identity can frame agreement as loyalty. Patriotic "
            "language alone does not establish manipulative intent."
        ),
    },
    {
        "id": "causal_oversimplification",
        "name": "Causal Oversimplification",
        "description": (
            "Attributing a complex situation to a single cause or group can distort "
            "reality. Simple explanations can also be correct."
        ),
    },
    {
        "id": "slogans",
        "name": "Slogans",
        "description": (
            "A catchy phrase can substitute for argument. Slogans can also be "
            "harmless rallying cries."
        ),
    },
    {
        "id": "appeal_to_authority",
        "name": "Appeal to Authority",
        "description": (
            "An unnamed authority may be used to lend weight to a claim. Relevant "
            "expertise is not itself propaganda; the source and evidence still "
            "matter."
        ),
    },
    {
        "id": "black_and_white_fallacy",
        "name": "Black-and-White Fallacy",
        "description": (
            "An either-or framing may leave out other options, or present one "
            "choice as inevitable. This scan cannot establish whether the "
            "alternatives are genuinely exhaustive."
        ),
    },
    {
        "id": "thought_terminating_cliches",
        "name": "Thought-Terminating Cliches",
        "description": (
            "A familiar phrase can shut down further questioning. Such phrases can "
            "also be harmless in casual speech."
        ),
    },
    {
        "id": "whataboutism_straw_man_red_herring",
        "name": "Whataboutism, Straw Man, Red Herring",
        "description": (
            "Deflecting to a different topic, misrepresenting an opponent, or "
            "diverting attention can avoid engaging with the actual point. These "
            "can also be honest comparisons when framed fairly."
        ),
    },
    {
        "id": "bandwagon_reductio_ad_hitlerum",
        "name": "Bandwagon, Reductio ad Hitlerum",
        "description": (
            "Claims that everyone agrees can make popularity seem like a reason to "
            "accept a position. Comparisons to Hitler or Nazis can shut down "
            "debate through association rather than argument."
        ),
    },
]

TECHNIQUE_NAMES: dict[str, str] = {t["id"]: t["name"] for t in TECHNIQUES}
