
class Timeless:
    def __init__(self, name, dna_source):
        self.name = name
        self.dna_source = dna_source
        self.abilities = {"enhance_allies_perception": 0, "enhance_allies_reflexes": 0}
        self.experience = 0
        self.is_alive = True

    def enhance_allies(self, allies):
        for ally in allies:
            ally.perception += self.abilities["enhance_allies_perception"]
            ally.reflexes += self.abilities["enhance_allies_reflexes"]

    def gain_experience(self, amount):
        self.experience += amount
        # Abilities scale with time and experience
        self.abilities["enhance_allies_perception"] = self.experience // 10
        self.abilities["enhance_allies_reflexes"] = self.experience // 10
