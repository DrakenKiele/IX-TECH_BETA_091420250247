# 🪙 Aniota Token Economy Guide

Understanding Aniota's educational token system and how to use it effectively.

## 🎯 What Are Tokens?

### The Core Concept
Tokens are the "currency" of training - they represent your investment in Aniota's education. Unlike unlimited systems, Aniota's tokens have **real value** because they're limited and must be earned through good training practices.

### Why Tokens Matter
- **Authentic Learning Pressure**: Limited resources teach you to train wisely
- **Educational Value**: Mirrors real-world resource management
- **Behavioral Psychology**: Creates meaningful investment in training outcomes
- **Progress Tracking**: Token flow indicates training effectiveness

## 💰 Your Token Balance

### Starting Tokens
- **Initial Balance**: 5 tokens (enough to learn the system)
- **Purpose**: Learn how tokens work without immediate pressure
- **Goal**: Earn more through good training practices

### Checking Your Balance
```javascript
// In browser console:
window.biomeModules.userTokenEconomy.getBalance()
```

### Token Display
- **Token Trainer Window**: Shows current balance at the top
- **Color Coding**: Green = plenty, Yellow = low, Red = very low
- **Real-time Updates**: Balance changes immediately when spent or earned

## 💸 Spending Tokens (You → Aniota)

### Token Costs by Reinforcement Type

| Reinforcement Type | Cost | When to Use | Effect on Aniota |
|-------------------|------|-------------|-----------------|
| **Strong Positive** | 3 tokens | Excellent behavior | Major trust boost |
| **Positive** | 2 tokens | Good behavior | Moderate trust gain |
| **Mild Positive** | 1 token | Small improvements | Small trust gain |
| **Mild Negative** | 1 token | Minor corrections | Small trust loss |
| **Negative** | 2 tokens | Problem behavior | Moderate trust loss |
| **Strong Negative** | 3 tokens | Serious issues | Major trust loss |

### When You Can't Afford Tokens
- **Insufficient Funds Message**: System warns before spending
- **No Transaction**: Aniota won't receive feedback if you can't pay
- **Earning Opportunity**: Time to focus on earning more tokens

### Strategic Token Use
- **Save Expensive Tokens**: Use strong reinforcements sparingly
- **Positive Focus**: Rewards cost the same as punishments but work better
- **Timing Matters**: Immediate feedback is worth the token cost
- **Quality over Quantity**: One well-timed token beats random clicking

## 💎 Earning Tokens (Aniota → You)

### Automatic Token Awards

| Learning Behavior | Tokens Earned | How to Trigger |
|------------------|---------------|----------------|
| **Session Completion** | +2 tokens | Train for 1+ minutes |
| **Consistent Training** | +2 tokens | 2+ minutes positive training |
| **Successful Command** | +1 token | Aniota obeys your command |
| **Patience Bonus** | +1 token | More positive than negative actions |
| **Behavior Discovery** | +3 tokens | Find new Aniota behaviors |
| **Research Contribution** | +5 tokens | Share learning data |

### How Earning Works
1. **Training Detection**: System recognizes when you're actively training
2. **Behavior Tracking**: Monitors your training patterns and consistency
3. **Automatic Awards**: Tokens appear in your balance with notification
4. **Session Summaries**: End-of-session bonuses for good practices

### Maximizing Token Earnings
- **Complete Full Sessions**: Don't quit early, finish your training
- **Stay Positive**: More rewards than corrections = bonus tokens
- **Be Consistent**: Regular training sessions earn more than sporadic bursts
- **Explore Behaviors**: Try new things to discover bonus behaviors
- **Train Patiently**: Avoid rapid-fire token clicking

## 📊 Token Flow Examples

### Example 1: Successful Training Session
```
Starting Balance: 8 tokens

Actions:
- Give command "sit" → Aniota sits → Give Positive (spend 2) → Balance: 6
- Aniota wanders → Give Mild Positive for exploration (spend 1) → Balance: 5  
- Give "sit" again → Aniota sits → Give Positive (spend 2) → Balance: 3
- Complete 3-minute session

Session End Rewards:
+ 2 tokens (session completion)
+ 2 tokens (consistent training) 
+ 1 token (patience bonus)

Final Balance: 8 tokens (broke even, but Aniota learned!)
```

### Example 2: Token Shortage
```
Starting Balance: 2 tokens

Actions:
- Give "sit" → Aniota ignores → Try Strong Negative → Can't afford!
- System suggests: "Insufficient tokens. Try earning more through patient training."
- Give "sit" again → Aniota sits → Give Mild Positive (spend 1) → Balance: 1
- Continue patient training for session completion bonus

Result: Learn to train within your means while earning more tokens
```

## 🎓 Educational Psychology

### Why This System Works
- **Investment Psychology**: When tokens cost something, you use them more carefully
- **Resource Management**: Teaches planning and strategic thinking
- **Positive Reinforcement Focus**: Rewards are just as "expensive" as punishments
- **Progress Feedback**: Token earnings indicate training skill improvement

### Real-World Applications
- **Pet Training**: Limited treats teach selective reinforcement
- **Teaching**: Attention and praise are finite resources
- **Management**: Recognition and rewards work better when meaningful
- **Personal Development**: Sustainable habits require strategic reinforcement

## 🔧 Token Economy Settings

### Current Configuration
```javascript
// Token costs (what you spend)
strong_positive: 3 tokens
positive: 2 tokens  
mild_positive: 1 token
mild_negative: 1 token
negative: 2 tokens
strong_negative: 3 tokens

// Token earnings (what you gain)
session_completion: +2 tokens
consistent_training: +2 tokens
successful_command: +1 token
patience_bonus: +1 token
behavior_discovery: +3 tokens
research_contribution: +5 tokens
```

### Balancing Philosophy
- **Earning > Spending**: Good training should be sustainable
- **Positive = Negative Costs**: No bias toward punishment
- **Session Bonuses**: Rewards consistency over intensity
- **Discovery Rewards**: Encourages exploration and curiosity

## 📈 Tracking Your Progress

### Token History
```javascript
// View your token earning/spending patterns
window.biomeModules.userTokenEconomy.learningMetrics
```

### Success Indicators
- **Net Positive Flow**: Earning more than spending over time
- **Session Completion Rate**: Regularly finishing training sessions
- **Patience Ratio**: More positive than negative reinforcements
- **Discovery Count**: Finding new behaviors regularly

### Warning Signs
- **Rapid Token Loss**: Spending faster than earning
- **Negative-Heavy Training**: Too much punishment, not enough reward
- **Short Sessions**: Not completing full training cycles
- **Token Spam**: Rapid-fire clicking without thoughtful feedback

## 🎯 Token Economy Goals

### Short-term Objectives
- **Maintain Positive Balance**: Don't run out of tokens
- **Learn Token Values**: Understand when to use expensive vs cheap tokens
- **Complete Sessions**: Earn those completion bonuses regularly

### Long-term Goals
- **Sustainable Training**: Earn enough to support regular training
- **Efficient Use**: Get maximum training value from each token
- **Research Contribution**: Earn bonus tokens by sharing learning data

## 💡 Pro Tips

### Token Management Strategies
1. **Start Small**: Use mild reinforcements until you learn Aniota's patterns
2. **Save Big Tokens**: Keep strong reinforcements for truly exceptional moments
3. **Focus on Positives**: Rewards work better than punishments anyway
4. **Complete Sessions**: Those 2-token bonuses add up quickly
5. **Explore Naturally**: Discovery bonuses are worth 3 tokens each!

### Troubleshooting Token Issues
- **"I keep running out!"** → Focus on session completion for steady income
- **"Tokens don't seem to matter!"** → Check if you're giving immediate feedback
- **"Earning is too slow!"** → Try longer, more consistent training sessions
- **"I don't understand the costs!"** → Start with 1-token mild reinforcements

---

**Remember**: The token economy teaches real training principles. In real life, your attention, treats, and praise are also limited resources that work best when used thoughtfully!

**Questions?** Check the Training Guide or technical documentation for more details.

Happy training! 🪙✨
