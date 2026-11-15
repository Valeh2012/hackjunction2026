from typesafe_sdk import Choice, Noul, Score, TypeSafeClient


client = TypeSafeClient(
    base_url="https://router.hostinger.com/",
    api_key="sk-hstgr-8243bbd8f690266f0c4e7955a4fcd22f10254e052b580449",
    model="jev-latest",
)

response = client.system_one(
    state="I was charged twice. Please fix this ASAP.",
    questions={
        "billing": Noul(instructions="Is this ticket about billing?"),
        "tone": Choice(
            instructions="What is the customer's tone?",
            criteria={"calm": None, "frustrated": None, "angry": None},
        ),
        "urgency": Score(
            instructions="How urgent is this ticket?",
            criteria=["can wait", "this week", "today"],
        ),
    },
)
print(response.nouls["billing"].noul)
print(response.choices["tone"].choice)
print(response.scores["urgency"].score)