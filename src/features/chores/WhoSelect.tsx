import type { SelectHTMLAttributes } from 'react';

type Props = SelectHTMLAttributes<HTMLSelectElement> & { members: string[] };

/** Who should do a chore. The values are what parseWho understands. */
export const WhoSelect = ({ members, ...props }: Props) => (
  <select name="who" className="input" {...props}>
    <option value="slumpa">🎲 Slumpa vem</option>
    <option value="alla">👥 Alla, var och en</option>
    {members.length > 0 && (
      <optgroup label="Ansvarig">
        {members.map((member) => (
          <option key={member} value={`person:${member}`}>
            📌 {member}
          </option>
        ))}
      </optgroup>
    )}
  </select>
);
